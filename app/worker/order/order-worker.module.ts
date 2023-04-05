import { Module } from '@nestjs/common';
import { CreateOrderService } from './create/create-order.service';
import { BullModule } from '@nestjs/bull';
import { QueueName, getBullQueuesConfig } from '@worker/worker-names';

@Module({
  imports: [
    BullModule.registerQueue(...getBullQueuesConfig([QueueName.CreateOrder])),
  ],
  providers: [CreateOrderService],
  exports: [CreateOrderService],
})
export class OrderWorkerModule {}
