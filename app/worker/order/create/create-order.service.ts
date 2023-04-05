import { Injectable } from '@nestjs/common/decorators';
import { CreateOrderPayload } from './create-order.payload';
import { InjectQueue } from '@nestjs/bull';
import { QueueName } from '@worker/worker-names';
import { Queue } from 'bull';

@Injectable()
export class CreateOrderService {
  constructor(
    @InjectQueue(QueueName.CreateOrder)
    private readonly createOrderQueue: Queue,
  ) {}

  addCreateOrderPayloadToQueue(payload: CreateOrderPayload) {
    this.createOrderQueue.add(payload);
  }
}
