import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  emailOrPhoneNumberOrUsername: string;

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
