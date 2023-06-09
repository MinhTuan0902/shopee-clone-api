import { ENVVariable } from '@common/module/env/env.constant';
import { ENVModule } from '@common/module/env/env.module';
import { ENVService } from '@common/module/env/env.service';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BullRegisterQueuesConfig } from '@worker/worker-names';
import { TwilioModule, TwilioModuleOptions } from 'nestjs-twilio';
import { SendSMSService } from './send-sms.service';

@Module({
  imports: [
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
    BullModule.registerQueue(BullRegisterQueuesConfig.sendSMS),
  ],
  providers: [SendSMSService],
  exports: [SendSMSService, TwilioModule],
})
export class SendSMSModule {}
