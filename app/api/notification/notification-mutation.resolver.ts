import {
  Notification,
  NotificationDocument,
} from '@mongodb/entity/notification/notification.entity';
import { Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Resolver()
export class NotificationMutationResolver {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}
}
