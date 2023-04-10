import { BaseFilterInput } from '@common/dto/base-filter.input';

export class FilterFeedbackInput extends BaseFilterInput {
  productId_equal?: string;
  orderId_equal?: string;
}
