import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateResetPasswordRequestInput {
  @Field(() => String)
  phoneNumber: string;
}

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  otp: string;

  @Field(() => String)
  newPassword: string;
}

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  currentPassword: string;

  @Field(() => String)
  newPassword: string;
}
