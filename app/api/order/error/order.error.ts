import { GraphQLBadRequestError } from '@common/error/graphql.error';

export class ProductAvailableQuantityNotEnoughError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'PRODUCT_AVAILABLE_QUANTITY_NOT_ENOUGH',
      message: "Product's available quantity is not enough",
    });
    this.name = 'ProductAvailableQuantityNotEnoughError';
  }
}

export class MaxDistinctProductOnOrderError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'MAX_DISTINCT_PRODUCT_EXCEED',
      message: 'Too many distinct product on order',
    });
    this.name = 'MaxDistinctProductOnOrderError';
  }
}
