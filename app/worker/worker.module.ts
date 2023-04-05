import { ENVVariable, NodeENV } from '@common/module/env/env.constant';
import { ENVModule } from '@common/module/env/env.module';
import { ENVService } from '@common/module/env/env.service';
import {
  Notification,
  NotificationSchema,
} from '@mongodb/entity/notification/notification.entity';
import { BullModule } from '@nestjs/bull/dist/bull.module';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { CreateOrderConsumer } from './order/create/create-order.consumer';
import { OrderWorkerModule } from './order/order-worker.module';
import { SendSMSConsumer } from './send-sms/send-sms.consumer';
import { SendSMSModule } from './send-sms/send-sms.module';
import { getBullQueuesConfig } from './worker-names';
import { PubSubModule } from '@common/module/pub-sub/pub-sub.module';

@Module({
  imports: [
    ENVModule,
    PubSubModule,
    BullModule.registerQueue(...getBullQueuesConfig()),
    MongooseModule.forRootAsync({
      imports: [ENVModule],
      inject: [ENVService],
      useFactory: (envService: ENVService): MongooseModuleOptions => {
        const nodeENV = envService.get(ENVVariable.NodeENV);
        return {
          uri:
            nodeENV === NodeENV.Development
              ? envService.get(ENVVariable.MongoURIDevelop)
              : envService.get(ENVVariable.MongoURIProduction),
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    SendSMSModule,
    OrderWorkerModule,
  ],
  providers: [
    // Consumers
    SendSMSConsumer,
    CreateOrderConsumer,
  ],
})
export class WorkerModule {}
