import { GraphQLBadRequestError } from '@common/error/graphql.error';
import { Locale } from '@mongodb/entity/user/enum/locale.enum';

export class CategoryNotFoundError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'CATEGORY_NOT_FOUND',
      message: 'Category is not found',
    });
    this.name = 'CategoryNotFoundError';
  }
}

export class CategoryAlreadyExistedError extends GraphQLBadRequestError {
  constructor(name: string, locale: Locale = Locale.Vietnamese) {
    super({
      messageCode: 'CATEGORY_ALREADY_EXISTED',
      message: `Category ${name} already existed`,
    });
    this.name = 'CategoryAlreadyExistedError';
  }
}
