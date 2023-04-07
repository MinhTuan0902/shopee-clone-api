import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { NotificationSendType } from '@mongodb/entity/notification/enum/send-type.enum';
import {
  Notification,
  NotificationDocument,
} from '@mongodb/entity/notification/notification.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { Model } from 'mongoose';
import { NotificationNotFoundError } from './error/notification.error';

@Resolver()
export class NotificationMutationResolver {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  @UseGuards(JWTGuard)
  @Mutation(() => Boolean)
  async markWasReadNotification(
    @Args('id') id: string,
    @CurrentUser() { userId }: JWTData,
  ): Promise<boolean> {
    if (!isMongoId(id)) {
      throw new NotificationNotFoundError();
    }
    const notification = await this.notificationModel.findOne({ _id: id });
    if (!notification) {
      throw new NotificationNotFoundError();
    }

    switch (notification.sendType) {
      case NotificationSendType.ForSpecificReceiver:
        if (notification?.specificReceiverId?.toString() !== userId) {
          throw new NotificationNotFoundError();
        }
        if (notification?.wasReadBySpecificReceiver) {
          return true;
        }
        await this.notificationModel.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              wasReadBySpecificReceiver: true,
            },
          },
        );
        return true;

      case NotificationSendType.ForAll:
        if (notification?.expiresAt) {
          throw new NotificationNotFoundError();
        }
        if (notification?.wasReadByReceiverIds?.includes(userId)) {
          return true;
        }
        await this.notificationModel.updateOne(
          {
            _id: id,
          },
          {
            $push: {
              wasReadByReceiverIds: userId,
            },
          },
        );
        return true;

      case NotificationSendType.ForReceivers:
        if (!notification?.receiverIds?.includes(userId)) {
          throw new NotificationNotFoundError();
        }
        if (notification?.wasReadByReceiverIds?.includes(userId)) {
          return true;
        }
        await this.notificationModel.updateOne(
          {
            _id: id,
          },
          {
            $push: {
              wasReadByReceiverIds: userId,
            },
          },
        );
        return true;
    }
  }

  @UseGuards(JWTGuard)
  @Mutation(() => Boolean)
  async markWasReadAllNotification(@CurrentUser() { userId }: JWTData) {
    await this.notificationModel.updateMany(
      {
        sendType: NotificationSendType.ForSpecificReceiver,
        specificReceiverId: userId,
        wasReadBySpecificReceiver: false,
      },
      {
        $set: {
          wasReadBySpecificReceiver: true,
        },
      },
    );

    await this.notificationModel.updateMany(
      {
        $or: [
          {
            sendType: NotificationSendType.ForReceivers,
          },
          {
            sendType: NotificationSendType.ForAll,
          },
        ],
        receiverIds: [userId],
      },
      {
        $addToSet: {
          wasReadByReceiverIds: userId,
        },
      },
    );

    return true;
  }
}
