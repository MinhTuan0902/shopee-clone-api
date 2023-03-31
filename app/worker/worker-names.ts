import { BullModuleOptions } from '@nestjs/bull';

export enum QueueName {
  SendSMS = 'send-sms',
  SendEmail = 'send-email',
  DeleteProducts = 'delete-products',
}

export const BullRegisterQueuesConfig: Record<string, BullModuleOptions> = {
  sendSMS: {
    name: QueueName.SendSMS,
    defaultJobOptions: {
      removeOnComplete: true,
    },
  },
  sendEmail: {
    name: QueueName.SendEmail,
    defaultJobOptions: {
      removeOnComplete: true,
    },
  },
  deleteProducts: {
    name: QueueName.DeleteProducts,
    defaultJobOptions: {
      removeOnComplete: true,
    },
  },
};
