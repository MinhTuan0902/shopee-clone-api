import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import { Process, Processor } from '@nestjs/bull';
import { QueueName } from '@worker/worker-names';
import { Job } from 'bull';
import { TwilioService } from 'nestjs-twilio';
import { SendSMSPayload } from './send-sms.payload';

@Processor(QueueName.SendSMS)
export class SendSMSConsumer {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly envService: ENVService,
  ) {}

  @Process()
  async handleSendSMS(job: Job<SendSMSPayload>) {
    const { toPhoneNumber, body } = job.data;
    this.sendSMS(toPhoneNumber, body);
  }

  sendSMS(toPhoneNumber: string, body: string) {
    this.twilioService.client.messages.create({
      from: this.envService.get(ENVVariable.TwilioVirtualPhoneNumber),
      to: toPhoneNumber,
      body,
    });
  }
}
