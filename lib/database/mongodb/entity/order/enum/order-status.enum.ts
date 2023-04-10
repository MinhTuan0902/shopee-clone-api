import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Processing = 'PROCESSING',
  Cancelled = 'CANCELLED',
  Shipping = 'SHIPPING',
  Done = 'DONE',
}
registerEnumType(OrderStatus, { name: 'OrderStatus' });
