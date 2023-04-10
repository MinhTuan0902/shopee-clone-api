import { BaseFilterInput } from '@common/dto/base-filter.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class FilterProductInput extends BaseFilterInput {
  name_equal?: string;
  availableQuantity_equal?: number;
  createByUserId_equal?: string;
}
