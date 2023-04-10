import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { NotificationSendType } from '@mongodb/entity/notification/enum/send-type.enum';
import { Notification } from '@mongodb/entity/notification/notification.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { createMongoId } from '@util/id';
import { createPaginatedObject } from '@util/paginated';
import { PipelineStage } from 'mongoose';
import { PaginatedNotification } from './dto/paginated-notification.response';
import { QueryNotificationInput } from './dto/query-notification.input';
import { ReadNotificationType } from './enum/read-notification-type.enum';
import { NotificationService } from './notification.service';

@Resolver()
export class NotificationQueryResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JWTGuard)
  @Query(() => PaginatedNotification)
  async getMyNotifications(
    @Args('input')
    { filter, option }: QueryNotificationInput,
    @CurrentUser() { userId }: JWTData,
  ): Promise<PaginatedNotification> {
    const { limit, offset } = option;
    const userObjectId = createMongoId(userId);
    let matchPipeline = {};

    switch (filter.readNotificationType) {
      case ReadNotificationType.WasRead:
        matchPipeline = {
          $or: [
            {
              sendType: NotificationSendType.ForSpecificReceiver,
              specificReceiverId: userObjectId,
              wasReadBySpecificReceiver: true,
            },
            {
              sendType: NotificationSendType.ForReceivers,
              receiverIds: [userObjectId],
              wasReadByReceiverIds: [userObjectId],
            },
            {
              sendType: NotificationSendType.ForAll,
              wasReadByReceiverIds: [userObjectId],
              expiresAt: {
                $lt: new Date(),
              },
            },
          ],
        };
        break;

      case ReadNotificationType.WasNotRead:
        matchPipeline = {
          $or: [
            {
              sendType: NotificationSendType.ForSpecificReceiver,
              specificReceiverId: userObjectId,
              wasReadBySpecificReceiver: false,
            },
            {
              sendType: NotificationSendType.ForReceivers,
              receiverIds: [userObjectId],
              wasReadByReceiverIds: { $nin: [userObjectId] },
            },
            {
              sendType: NotificationSendType.ForAll,
              wasReadByReceiverIds: { $nin: [userObjectId] },
              expiresAt: {
                $lt: new Date(),
              },
            },
          ],
        };
        break;

      case ReadNotificationType.All:
        matchPipeline = {
          $or: [
            {
              sendType: NotificationSendType.ForSpecificReceiver,
              specificReceiverId: userObjectId,
            },
            {
              sendType: NotificationSendType.ForReceivers,
              receiverIds: [userObjectId],
            },
            {
              sendType: NotificationSendType.ForAll,
              expiresAt: {
                $lt: new Date(),
              },
            },
          ],
        };
        break;
    }

    const pipelines: PipelineStage[] = [
      {
        $match: matchPipeline,
      },
    ];
    const notifications = (await this.notificationService.findManyByPipelines([
      ...pipelines,
      { $skip: offset },
      { $limit: limit },
    ])) as Notification[];
    const totalItems = await this.notificationService.countByPipelines(
      pipelines,
    );

    return createPaginatedObject(notifications, totalItems, limit, offset);
  }
}
