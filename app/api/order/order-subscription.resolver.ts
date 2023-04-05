import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { SubscriptionMessage } from '@common/module/pub-sub/enum/subscription-message.enum';
import { Notification } from '@mongodb/entity/notification/notification.entity';
import { UseGuards } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class OrderSubscriptionResolver {
  constructor(private readonly pubSub: RedisPubSub) {}

  @UseGuards(JWTGuard)
  @Subscription(() => Notification, {
    filter(payload, variables, context) {
      return payload?.notification?.specificReceiverIds?.includes(
        context?.req?.user?.userId,
      );
    },
    resolve(payload, args, context, info) {
      return payload?.notification;
    },
  })
  subOrderCreated() {
    this.pubSub.asyncIterator(SubscriptionMessage.OrderCreated);
  }
}
