import { registerEnumType } from '@nestjs/graphql';

export enum ReadNotificationType {
  WasRead = 'WAS_READ',
  WasNotRead = 'WAS_NOT_READ',
  All = 'ALL',
}
registerEnumType(ReadNotificationType, { name: 'ReadNotificationType' });
