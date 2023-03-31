import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Pending = 'PENDING',
  Splitted = 'SPLITTED',
  Cancelled = 'CANCELLED',
  Shipping = 'SHIPPING',
  Done = 'DONE',
}
registerEnumType(OrderStatus, { name: 'OrderStatus' });
