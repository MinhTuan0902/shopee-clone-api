import { registerEnumType } from '@nestjs/graphql';

export enum NotificationSendType {
  ForAll = 'FOR_ALL',
  ForSpecificReceiver = 'FOR_SPECIFIC_RECEIVER',
  ForReceivers = 'FOR_RECEIVERS',
}
registerEnumType(NotificationSendType, { name: 'NotificationSendType' });
