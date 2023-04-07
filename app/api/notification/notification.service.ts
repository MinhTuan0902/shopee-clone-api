import { IService } from '@common/interface/service.interface';
import {
  Notification,
  NotificationDocument,
} from '@mongodb/entity/notification/notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
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

  async findManyByPipelines(pipelines: PipelineStage[]): Promise<any[]> {
    return await this.notificationModel.aggregate(pipelines);
  }

  async countByPipelines(pipelines: PipelineStage[]): Promise<number> {
    const totalItems = await this.notificationModel.aggregate([
      ...pipelines,
      { $count: 'counter' },
    ]);
    return totalItems.length === 0 ? 0 : totalItems[0]?.counter;
  }
}
