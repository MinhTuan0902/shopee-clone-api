import { BaseFilterInput } from '@common/dto/base-filter.input';
import { InputType } from '@nestjs/graphql';

// Filter
// Sort
// Option: limit && skip

@InputType()
export class FilterOrderInput extends BaseFilterInput {}
