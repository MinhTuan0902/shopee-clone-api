import { CreateSpecificReceiverNotificationInput } from '@api/notification/dto/create-notification.input';
import { CreateOrderNotificationVariable } from '@api/notification/interface/notification-variable.interface';
import { SubscriptionMessage } from '@common/module/pub-sub/enum/subscription-message.enum';
import { NotificationType } from '@mongodb/entity/notification/enum/notification-type.enum';
import { NotificationSendType } from '@mongodb/entity/notification/enum/send-type.enum';
import {
  Notification,
  NotificationDocument,
  NotificationMessage,
} from '@mongodb/entity/notification/notification.entity';
import { Locale } from '@mongodb/entity/user/enum/locale.enum';
import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { processNotificationMessage } from '@util/notification';
import { getObjectKeys } from '@util/object';
import { getEndDayDateTime, getStartDayDateTime } from '@util/time';
import { QueueName } from '@worker/worker-names';
import { Job } from 'bull';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Model } from 'mongoose';
import { CreateOrderPayload } from './create-order.payload';

@Processor(QueueName.CreateOrder)
export class CreateOrderConsumer {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly pubSub: RedisPubSub,
  ) {}

  @Process({ concurrency: 10 })
  async handleCreateOrder(job: Job<CreateOrderPayload>) {
    try {
      const { sellerId, createdAt } = job.data;
      const notificationType = NotificationType.OrderCreated;
      const notificationSendType = NotificationSendType.ForSpecificReceiver;
      const startDateTimestamp = getStartDayDateTime(createdAt).getTime();
      const endDateTimestamp = getEndDayDateTime(createdAt).getTime();
      const key = `${sellerId}:${startDateTimestamp}:${endDateTimestamp}`;

      let notificationMessages: NotificationMessage[];
      let stringVariables: string;
      let createOrderNotificationVariable: CreateOrderNotificationVariable;

      let previousNotification = await this.notificationModel.findOne({
        key: key,
      });

      /**
       * If database has @previousNotification and it was not read, it will be override and publish again
       */
      if (
        previousNotification &&
        !previousNotification?.wasReadBySpecificReceiver
      ) {
        const { totalOrder } = JSON.parse(
          previousNotification?.stringVariables,
        ) as CreateOrderNotificationVariable;

        createOrderNotificationVariable = {
          totalOrder: totalOrder + 1,
        };
        stringVariables = JSON.stringify(createOrderNotificationVariable);
        notificationMessages = getObjectKeys(Locale).map((key) => {
          return {
            locale: Locale[key],
            content: processNotificationMessage(
              notificationType,
              Locale[key],
              stringVariables,
            ),
          };
        });
        previousNotification = await this.notificationModel.findOneAndUpdate(
          {
            _id: previousNotification._id,
          },
          {
            $set: {
              createdAt: new Date(),
              updatedAt: new Date(),
              messages: notificationMessages,
              stringVariables: stringVariables,
            },
          },
          { $new: true },
        );

        this.pubSub.publish(SubscriptionMessage.OrderCreated, {
          notification: previousNotification,
        });

        return;
      }

      createOrderNotificationVariable = {
        totalOrder: 1,
      };
      stringVariables = JSON.stringify(createOrderNotificationVariable);
      notificationMessages = getObjectKeys(Locale).map((key) => {
        return {
          locale: Locale[key],
          content: processNotificationMessage(
            NotificationType.OrderCreated,
            Locale[key],
            JSON.stringify({ totalOrder: 1 }),
          ),
        };
      });

      const input: CreateSpecificReceiverNotificationInput = {
        type: notificationType,
        sendType: notificationSendType,
        specificReceiverId: sellerId,
        messages: notificationMessages,
        stringVariables: stringVariables,
        wasReadBySpecificReceiver: false,
        key: key,
      };
      const newNotification = await this.notificationModel.create(input);

      this.pubSub.publish(SubscriptionMessage.OrderCreated, {
        notification: newNotification,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
