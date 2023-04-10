import { JWTData } from '@api/auth/type/jwt-data.type';
import { CategoryService } from '@api/category/category.service';
import { CategoryNotFoundError } from '@api/category/error/category.error';
import { MediaService } from '@api/media/media.service';
import { Injectable } from '@nestjs/common';
import { transformTextToSlugs } from '@util/string';
import * as dayjs from 'dayjs';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import {
  DisplayMediasNotFoundError,
  InvalidProductQuantityError,
  ProductAlreadyExistedError,
  ProductNotFoundError,
  ThumbnailMediaNotFoundError,
} from '../error/product.error';
import { ProductService } from '../product.service';

@Injectable()
export class ProductInputValidator {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly mediaService: MediaService,
  ) {}

  async validateCreateProductInputData(
    input: CreateProductInput,
    { userId }: JWTData,
  ): Promise<CreateProductInput> {
    const {
      name,
      categoryIds,
      thumbnailMediaId,
      displayMediaIds,
      types,
      availableQuantity,
      salePrice,
      saleTo,
    } = input;
    if (
      await this.productService.findOneBasic({
        deletedAt_equal: null,
        createByUserId_equal: userId,
        name_equal: name,
      })
    ) {
      throw new ProductAlreadyExistedError(name);
    }

    const thumbnailMedia = await this.mediaService.findOneBasic({
      id_equal: thumbnailMediaId,
      createByUserId_equal: userId,
    });
    if (!thumbnailMedia) {
      throw new ThumbnailMediaNotFoundError();
    }
    input.thumbnailMedia = thumbnailMedia;

    if (displayMediaIds && displayMediaIds.length) {
      const displayMedias = await this.mediaService.findManyBasic({
        id_in: displayMediaIds,
        createByUserId_equal: userId,
      });
      if (displayMedias.length !== displayMediaIds.length) {
        throw new DisplayMediasNotFoundError();
      }
      input.displayMedias = displayMedias;
    }

    if (categoryIds && categoryIds.length) {
      const categories = await this.categoryService.findManyBasic({
        id_in: categoryIds,
      });
      if (categoryIds.length !== categories.length) {
        throw new CategoryNotFoundError();
      }
      input.categories = categories;
    }

    if (types && types.length) {
      let totalQuantity = 0;
      for (let i = 0; i < types.length; i++) {
        const { originalPrice, availableQuantity } = types[i];
        // TODO: validate
        if (!originalPrice) {
          types[i].originalPrice = input.originalPrice;
        }
        const thumbnailMedia = await this.mediaService.findOneBasic({
          id_equal: types[i].thumbnailMediaId,
        });
        if (!thumbnailMedia) {
          throw new ThumbnailMediaNotFoundError();
        }
        input.types[i].thumbnailMedia = thumbnailMedia;
        totalQuantity += availableQuantity;
      }
      if (totalQuantity !== availableQuantity)
        throw new InvalidProductQuantityError();
    }

    return {
      ...input,
      createByUserId: userId,
      slugs: transformTextToSlugs(name),
      salePrice: salePrice && saleTo ? salePrice : undefined,
      saleTo:
        salePrice && saleTo ? dayjs(saleTo).endOf('day').toDate() : undefined,
    };
  }

  async validateUpdateProductInputData(
    input: UpdateProductInput,
    { userId }: JWTData,
  ): Promise<void> {
    const { name, categoryIds, types, availableQuantity } = input;
    const productId = input.id;
    const product = await this.productService.findOneBasic({
      deletedAt_equal: null,
      createByUserId_equal: userId,
      id_equal: productId,
    });
    if (!product) {
      throw new ProductNotFoundError();
    }

    if (
      name &&
      name !== product.name &&
      (await this.productService.findOneBasic({
        deletedAt_equal: null,
        createByUserId_equal: userId,
        name_equal: name,
      }))
    ) {
      throw new ProductAlreadyExistedError(name);
    }

    if (categoryIds && categoryIds.length) {
      const categories = await this.categoryService.findManyBasic({
        id_in: categoryIds,
      });
      if (categoryIds.length !== categories.length) {
        throw new CategoryNotFoundError();
      }
      input.categories = categories;
    }

    if (types && availableQuantity) {
      let totalQuantity = 0;
      for (let i = 0; i < types.length; i++) {
        if (!types[i].originalPrice) {
          types[i].originalPrice = input.originalPrice;
        }
        const thumbnailMedia = await this.mediaService.findOneBasic({
          id_equal: types[i].thumbnailMediaId,
        });
        if (!thumbnailMedia) {
          throw new ThumbnailMediaNotFoundError();
        }
        input.types[i].thumbnailMedia = thumbnailMedia;
        totalQuantity += types[i].availableQuantity;
      }
      if (totalQuantity !== availableQuantity)
        throw new InvalidProductQuantityError();
    }
  }
}
