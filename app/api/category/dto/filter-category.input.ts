import { BaseFilterInput } from '@common/dto/base-filter.input';
import { Field, InputType, PickType } from '@nestjs/graphql';

@InputType()
export class FilterCategoryInput extends PickType(BaseFilterInput, [
  'id_equal',
  'id_notEqual',
  'id_in',
  'id_notIn',
] as const) {
  @Field(() => String, { nullable: true })
  name_equal?: string;
}
