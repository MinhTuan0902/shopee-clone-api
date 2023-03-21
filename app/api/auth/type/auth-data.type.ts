import { ObjectType } from '@nestjs/graphql';
import { JWT } from './jwt.type';

@ObjectType()
export class AuthData {
  accessToken: JWT;
  refreshToken: JWT;
}
