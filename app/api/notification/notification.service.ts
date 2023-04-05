import { IService } from '@interface/service.interface';
import {
  Notification,
  NotificationDocument,
} from '@mongodb/entity/notification/notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationInput } from './dto/create-notification.input';

@Injectable()
export class NotificationService implements IService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  createOne(input: CreateNotificationInput): Promise<Notification> {
    return this.notificationModel.create(input);
  }
}
