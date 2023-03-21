import { ENVVariable } from '@common/module/env/env.constant';
import { ENVModule } from '@common/module/env/env.module';
import { ENVService } from '@common/module/env/env.service';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueName } from '@worker/worker-names';
import { TwilioModule, TwilioModuleOptions } from 'nestjs-twilio';
import { SMSSenderService } from './sms.sender.service';

@Module({
  imports: [
    ENVModule,
    TwilioModule.forRootAsync({
      imports: [ENVModule],
      inject: [ENVService],
      useFactory: (envService: ENVService): TwilioModuleOptions => {
        return {
          accountSid: envService.get(ENVVariable.TwilioAccountSID),
          authToken: envService.get(ENVVariable.TwilioAuthToken),
        };
      },
    }),
    BullModule.registerQueue({
      name: QueueName.SMSSender,
    }),
  ],
  providers: [SMSSenderService],
  exports: [SMSSenderService],
})
export class SMSSenderModule {}
