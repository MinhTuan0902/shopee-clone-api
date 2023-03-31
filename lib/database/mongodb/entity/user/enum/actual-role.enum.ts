import { registerEnumType } from '@nestjs/graphql';

export enum ActualRole {
  Customer = 'CUSTOMER',
  Seller = 'SELLER',
  Transporter = 'TRANSPORTER',
}
registerEnumType(ActualRole, {
  name: 'ActualRole',
});
