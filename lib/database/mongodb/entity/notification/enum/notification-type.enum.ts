import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  OrderCreated = 'ORDER_CREATED',
}
registerEnumType(NotificationType, { name: 'NotificationType' });
