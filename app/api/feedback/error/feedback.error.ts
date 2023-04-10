import { GraphQLBadRequestError } from '@common/error/graphql.error';

export class DuplicateFeedbackError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'DUPLICATE_FEEDBACK',
      message: 'You have created a feedback before',
    });
    this.name = 'DuplicateFeedbackError';
  }
}
