import { Field, ObjectType } from '@nestjs/graphql';
import { JWTType } from '../enum/jwt-type.enum';

@ObjectType()
export class JWT {
  @Field(() => String)
  token: string;

  @Field(() => Date)
  expiresAt: Date;

  @Field(() => JWTType)
  type: JWTType;
}
