import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, MinLength } from 'class-validator';

@InputType()
export class CreateResetPasswordRequestInput {
  @IsPhoneNumber('VN', {
    message: 'phoneNumber must be a valid Vietnamese phone number',
  })
  @Field(() => String)
  phoneNumber: string;
}

@InputType()
export class ResetPasswordInput {
  @IsPhoneNumber('VN', {
    message: 'phoneNumber must be a valid Vietnamese phone number',
  })
  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  otp: string;

  @MinLength(8, {
    message: "newPassword's length must be greater than or equal to 8",
  })
  @Field(() => String)
  newPassword: string;
}

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  currentPassword: string;

  @MinLength(8, {
    message: "newPassword's length must be greater than or equal to 8",
  })
  @Field(() => String)
  newPassword: string;
}
