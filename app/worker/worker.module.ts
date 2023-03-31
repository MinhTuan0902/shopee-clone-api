import { ENVModule } from '@common/module/env/env.module';
import { BullModule } from '@nestjs/bull/dist/bull.module';
import { Module } from '@nestjs/common';
import { SendSMSConsumer } from './send-sms/send-sms.consumer';
import { SendSMSModule } from './send-sms/send-sms.module';
import { QueueName } from './worker-names';

@Module({
  imports: [
    ENVModule,
    BullModule.registerQueue({
      name: QueueName.SendSMS,
    }),
    SendSMSModule,
  ],
  providers: [
    // Consumers
    SendSMSConsumer,
  ],
})
export class WorkerModule {}
