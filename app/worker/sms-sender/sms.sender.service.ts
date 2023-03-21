import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueName } from '@worker/worker-names';
import { Queue } from 'bull';
import { SMSSenderPayload } from './sms-sender.payload';

@Injectable()
export class SMSSenderService {
  constructor(
    @InjectQueue(QueueName.SMSSender) private readonly smsSenderQueue: Queue,
  ) {}

  addSMSSenderPayloadToQueue(payload: SMSSenderPayload) {
    this.smsSenderQueue.add(payload);
  }
}
