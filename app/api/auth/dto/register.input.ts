import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { Locale } from '@mongodb/entity/user/enum/locale.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateRegisterRequest {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('VN', {
    message: 'phoneNumber must be a valid Vietnamese phone number',
  })
  @Field(() => String)
  phoneNumber: string;
}

@InputType()
export class RegisterInput {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'fullName must be at least 6 characters length' })
  @MaxLength(50, { message: 'fullName must be at least 6 characters length' })
  @Field(() => String)
  fullName: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  otp: string;

  @Field(() => ActualRole, { defaultValue: ActualRole.Customer })
  actualRole: ActualRole;

  @Field(() => Locale, { defaultValue: Locale.Vietnamese })
  locale: Locale;
}
