import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueName } from '@worker/worker-names';
import { Queue } from 'bull';
import { SendSMSPayload } from './send-sms.payload';

@Injectable()
export class SendSMSService {
  constructor(
    @InjectQueue(QueueName.SendSMS) private readonly sendSMSQueue: Queue,
  ) {}

  addSendSMSPayloadToQueue(payload: SendSMSPayload) {
    this.sendSMSQueue.add(payload);
  }
}
