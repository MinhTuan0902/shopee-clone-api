import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { Locale } from '@mongodb/entity/user/enum/locale.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateRegisterRequest {
  @IsPhoneNumber('VN', {
    message: 'phoneNumber must be a valid Vietnamese phone number',
  })
  @Field(() => String)
  phoneNumber: string;
}

@InputType()
export class RegisterInput {
  @MinLength(8, {
    message: "fullName's length must be greater than or equal to 8",
  })
  @MaxLength(64, {
    message: "fullName's length must be less than or equal to 64",
  })
  @Field(() => String)
  fullName: string;

  @IsPhoneNumber('VN', {
    message: 'phoneNumber must be a valid Vietnamese phone number',
  })
  @Field(() => String)
  phoneNumber: string;

  @MinLength(8, {
    message: "password's length must be greater than or equal to 8",
  })
  @Field(() => String)
  password: string;

  @Field(() => String)
  otp: string;

  @Field(() => ActualRole, { defaultValue: ActualRole.Customer })
  actualRole: ActualRole;

  @Field(() => Locale, { defaultValue: Locale.Vietnamese })
  locale: Locale;
}
