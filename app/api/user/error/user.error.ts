import { GraphQLNotFoundError } from '@common/error/graphql.error';

export class UserNotFoundError extends GraphQLNotFoundError {
  constructor() {
    super({
      messageCode: 'USER_NOT_FOUND',
      message: 'User is not found',
    });
    this.name = 'UserNotFoundError';
  }
}
