import { GraphQLBadRequestError } from '@common/error/graphql.error';

export class CategoryNotFoundError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'CATEGORY_NOT_FOUND',
      message: 'Category is not found',
    });
    this.name = 'CategoryNotFoundError';
  }
}
