import { Field, ObjectType } from '@nestjs/graphql';
import { JWT } from './jwt.type';

@ObjectType()
export class AuthData {
  @Field(() => JWT)
  accessToken: JWT;

  @Field(() => JWT)
  refreshToken: JWT;
}
