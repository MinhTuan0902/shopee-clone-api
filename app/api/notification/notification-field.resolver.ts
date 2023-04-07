import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { NotificationSendType } from '@mongodb/entity/notification/enum/send-type.enum';
import { Notification } from '@mongodb/entity/notification/notification.entity';
import { UseGuards } from '@nestjs/common';
import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => Notification)
export class NotificationFieldResolver {
  // TODO: refactor
  @UseGuards(JWTGuard)
  @ResolveField(() => [ID])
  receiverIds(
    @Parent() notification: Notification,
    @CurrentUser() { userId }: JWTData,
  ): string[] {
    if (notification?.sendType === NotificationSendType.ForReceivers) {
      return notification?.receiverIds?.filter((id) => {
        if (id === userId) {
          return [userId];
        }
      });
    }
  }

  @UseGuards(JWTGuard)
  @ResolveField(() => [ID])
  wasReadByReceiverIds(
    @Parent() notification: Notification,
    @CurrentUser() { userId }: JWTData,
  ): string[] {
    if (notification?.sendType === NotificationSendType.ForReceivers) {
      return notification?.receiverIds?.filter((id) => {
        if (id === userId) {
          return [userId];
        }
      });
    }
  }
}
