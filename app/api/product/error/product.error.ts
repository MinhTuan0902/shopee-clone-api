import { GraphQLBadRequestError } from '@common/error/graphql.error';

export class ProductNotFoundError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'PRODUCT_NOT_FOUND',
      message: 'Product is not found',
    });
    this.name = 'ProductNotFoundError';
  }
}

export class ProductAlreadyExistedError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'PRODUCT_ALREADY_EXISTED',
      message: 'Product already existed',
    });
    this.name = 'ProductAlreadyExistedError';
  }
}

export class ThumbnailMediaNotFoundError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'THUMBNAIL_MEDIA_NOT_FOUND',
      message: 'Thumbnail media is not found',
    });
    this.name = 'ThumbnailMediaNotFoundError';
  }
}

export class DisplayMediasNotFoundError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'DISPlAY_MEDIAS_NOT_FOUND',
      message: 'Display medias are not found',
    });
    this.name = 'DisplayMediasNotFoundError';
  }
}
