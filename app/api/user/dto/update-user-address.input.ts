import { AddressInput } from '@api/geo/dto/address.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserAddressInput extends AddressInput {
  userId: string;
}
