import { BullModuleOptions } from '@nestjs/bull';

export enum QueueName {
  SMSSender = 'sms:sender',
  EmailSender = 'email:sender',
}

export const BullRegisterQueuesConfig: Record<string, BullModuleOptions> = {
  smsSender: {
    name: QueueName.SMSSender,
    defaultJobOptions: {
      removeOnComplete: true,
    },
  },
  emailSender: {
    name: QueueName.EmailSender,
    defaultJobOptions: {
      removeOnComplete: true,
    },
  },
};
