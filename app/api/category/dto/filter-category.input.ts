import { BaseFilterInput } from '@common/dto/base-filter.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class FilterCategoryInput extends BaseFilterInput {}
