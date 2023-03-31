import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
}
registerEnumType(UserStatus, { name: 'UserStatus' });
