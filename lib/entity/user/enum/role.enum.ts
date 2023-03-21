import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
  Seller = 'SELLER',
}
registerEnumType(Role, { name: 'Role' });
