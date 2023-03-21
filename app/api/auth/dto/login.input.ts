import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  emailOrPhoneNumber: string;

  @Field(() => String)
  password: string;
}
