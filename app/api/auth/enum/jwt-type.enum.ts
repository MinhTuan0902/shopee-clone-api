import { registerEnumType } from '@nestjs/graphql';

export enum JWTType {
  AccessToken = 'ACCESS_TOKEN',
  RefreshToken = 'REFRESH_TOKEN',
}
registerEnumType(JWTType, { name: 'JWTType' });
