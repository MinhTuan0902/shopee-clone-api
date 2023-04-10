import { BaseFilterInput } from '@common/dto/base-filter.input';

export class FilterMediaInput extends BaseFilterInput {
  createByUserId_equal?: string;
}
