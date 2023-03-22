import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JWT {
  @Field(() => String)
  token: string;

  @Field(() => Date)
  expiresAt: Date;
}
