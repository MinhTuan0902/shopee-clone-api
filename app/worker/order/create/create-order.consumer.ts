import { CreateNotificationInput } from '@api/notification/dto/create-notification.input';
import { SubscriptionMessage } from '@common/module/pub-sub/enum/subscription-message.enum';
import { CreateOrderNotificationVariable } from '@interface/notification-variable.interface';
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
import { getAllEnumKey } from '@util/enum';
import { processNotificationMessage } from '@util/notification';
import { getEndDayTime, getStartDayTime } from '@util/time';
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

  @Process()
  async handleCreateOrder(job: Job<CreateOrderPayload>) {
    try {
      const { sellerId } = job.data;
      const notificationType = NotificationType.OrderCreated;
      const notificationSendType = NotificationSendType.ForSpecificReceiver;
      let notificationMessages: NotificationMessage[];
      let stringVariables: string;
      let createOrderNotificationVariable: CreateOrderNotificationVariable;

      let previousNotification = await this.notificationModel.findOne({
        type: notificationType,
        specificReceiverId: sellerId,
        sendType: notificationSendType,
        wasReadBySpecificReceiver: false,
        createdAt: {
          $gte: getStartDayTime(),
          $lte: getEndDayTime(),
        },
      });
      if (previousNotification) {
        const { totalOrder } = JSON.parse(
          previousNotification?.stringVariables,
        ) as CreateOrderNotificationVariable;
        createOrderNotificationVariable = {
          totalOrder: totalOrder + 1,
        };
        notificationMessages = getAllEnumKey(Locale).map((key) => {
          return {
            locale: Locale[key],
            message: processNotificationMessage(
              NotificationType.OrderCreated,
              Locale[key],
              JSON.stringify({ totalOrder: totalOrder + 1 }),
            ),
          };
        });
        stringVariables = JSON.stringify(createOrderNotificationVariable);
        previousNotification = await this.notificationModel.findOneAndUpdate(
          {
            _id: previousNotification._id,
          },
          {
            $set: {
              createdAt: new Date(),
              updatedAt: new Date(),
              messages: notificationMessages,
              stringVariables,
            },
          },
          { $new: true },
        );
        this.pubSub.publish(SubscriptionMessage.OrderCreated, {
          previousNotification,
        });
        return;
      }

      createOrderNotificationVariable = {
        totalOrder: 1,
      };
      stringVariables = JSON.stringify(createOrderNotificationVariable);
      notificationMessages = getAllEnumKey(Locale).map((key) => {
        return {
          locale: Locale[key],
          message: processNotificationMessage(
            NotificationType.OrderCreated,
            Locale[key],
            JSON.stringify({ totalOrder: 1 }),
          ),
        };
      });
      const input: CreateNotificationInput = {
        type: notificationType,
        sendType: notificationSendType,
        specificReceiverId: sellerId,
        messages: notificationMessages,
        stringVariables,
      };
      const newNotification = await this.notificationModel.create({
        ...input,
        wasReadBySpecificReceiver: false,
      });
      console.log(newNotification);
    } catch (error) {
      console.error(error);
    }
  }
}
