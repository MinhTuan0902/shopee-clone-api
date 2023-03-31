import { GraphQLBadRequestError } from '@common/error/graphql.error';

export class MediaNotFoundError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'MEDIA_NOT_FOUND',
      message: 'Media is not found',
    });
    this.name = 'MediaNotFoundError';
  }
}
