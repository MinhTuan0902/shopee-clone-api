import { CoreModule } from '@common/module/core/core.module';
import { BullModule } from '@nestjs/bull/dist/bull.module';
import { Module } from '@nestjs/common';
import { SMSSenderConsumer } from './sms-sender/sms-sender.consumer';
import { SMSSenderModule } from './sms-sender/sms-sender.module';
import { QueueName } from './worker-names';

@Module({
  imports: [
    CoreModule,
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
