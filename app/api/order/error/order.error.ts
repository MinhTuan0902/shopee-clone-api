import {
  GraphQLBadRequestError,
  GraphQLNotFoundError,
} from '@common/error/graphql.error';

export class ProductAvailableQuantityNotEnoughError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'PRODUCT_AVAILABLE_QUANTITY_NOT_ENOUGH',
      message: "Product's available quantity is not enough",
    });
    this.name = 'ProductAvailableQuantityNotEnoughError';
  }
}

export class InvalidProductTypeError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'INVALID_PRODUCT_TYPE_ERROR',
      message: 'Create order input data must contains product type',
    });
    this.name = 'InvalidProductTypeError';
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

export class TooManyDistinctSellerError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'TOO_MANY_DISTINCT_SELLER',
      message: 'Order must have products from general seller',
    });
    this.name = 'TooManyDistinctSellerError';
  }
}

export class OrderedProductQuantityLargerThanAvailableError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'Order',
      message: "Ordered product's quantity is larger than available quantity",
    });
    this.name = 'OrderedProductQuantityLargerThanAvailableError';
  }
}

export class OrderNotFoundError extends GraphQLNotFoundError {
  constructor() {
    super({
      messageCode: 'ORDER_NOT_FOUND',
      message: 'Order is not found',
    });
    this.name = 'OrderNotFoundError';
  }
}
