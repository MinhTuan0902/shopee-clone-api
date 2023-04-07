import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber } from 'class-validator';

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
  @IsPhoneNumber('VN', {
    message: 'phoneNumber must be a valid Vietnamese phone number',
  })
  @Field(() => String)
  phoneNumber: string;
}

@InputType()
export class LoginWithOTPInput {
  @IsPhoneNumber('VN', {
    message: 'phoneNumber must be a valid Vietnamese phone number',
  })
  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  otp: string;
}
