import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Pending = 'PENDING',
  Cancelled = 'CANCELLED',
  Shipping = 'SHIPPING',
  Done = 'DONE',
}
registerEnumType(OrderStatus, { name: 'OrderStatus' });
