import { BaseFilterInput } from '@common/dto/base-filter.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class FilterUserInput extends BaseFilterInput {
  phoneNumber_equal?: string;
}
