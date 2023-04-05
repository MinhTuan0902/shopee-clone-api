import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String, {
    description: 'It can be email, username or phone number',
  })
  username: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class CreateLoginOTPInput {
  @Field(() => String)
  phoneNumber: string;
}

@InputType()
export class LoginWithOTPInput {
  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  otp: string;
}
