import { ActualRole } from '@entity/user/enum';
import { InputType, Field } from '@nestjs/graphql';

// TODO: update validate and validator decorators

@InputType()
export class CreateRegisterRequest {
  @Field()
  phoneNumber: string;
}

@InputType()
export class RegisterInput {
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
}
