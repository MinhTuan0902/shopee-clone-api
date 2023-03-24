import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
}
registerEnumType(Role, { name: 'Role' });
