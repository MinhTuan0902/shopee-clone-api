import { BullModuleOptions } from '@nestjs/bull';

export enum QueueName {
  SendSMS = 'send-sms',
  SendEmail = 'send-email',
  CreateOrder = 'create-oder',
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
  createOrder: {
    name: QueueName.CreateOrder,
    defaultJobOptions: {
      removeOnComplete: true,
    },
  },
};

/**
 *
 * @param queueNameKeys Key from enum QueueName
 * @returns Bull queues config that has `name` included to `queueNameKeys`
 */
export function getBullQueuesConfig(queueNames?: string[]) {
  /**
   * Return all Bull queue config if @queueNameKeys is falsy or empty array
   */
  const allBullQueuesConfig = Object.values(BullRegisterQueuesConfig);
  if (!queueNames || queueNames.length === 0) {
    return allBullQueuesConfig;
  }

  const configs: BullModuleOptions[] = [];
  for (const config of allBullQueuesConfig) {
    if (queueNames.includes(config?.name)) {
      configs.push(config);
    }
  }

  return configs;
}
