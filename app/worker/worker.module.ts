import { ENVModule } from '@common/module/env/env.module';
import { BullModule } from '@nestjs/bull/dist/bull.module';
import { Module } from '@nestjs/common';
import { SMSSenderConsumer } from './sms-sender/sms-sender.consumer';
import { SMSSenderModule } from './sms-sender/sms-sender.module';
import { QueueName } from './worker-names';

@Module({
  imports: [
    ENVModule,
    BullModule.registerQueue({
      name: QueueName.SMSSender,
    }),
    SMSSenderModule,
  ],
  providers: [
    // Consumers
    SMSSenderConsumer,
  ],
})
export class WorkerModule {}
