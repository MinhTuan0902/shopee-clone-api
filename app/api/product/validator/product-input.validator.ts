import { JWTData } from '@api/auth/type/jwt-data.type';
import { CategoryService } from '@api/category/category.service';
import { CategoryNotFoundError } from '@api/category/error/category.error';
import { MediaService } from '@api/media/media.service';
import { Injectable } from '@nestjs/common';
import { transformTextToSlugs } from '@util/string';
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
      categoryId,
      thumbnailMediaId,
      displayMediaIds,
      types,
      availableQuantity,
    } = input;
    if (
      await this.productService.findOneBasic({
        deletedAt_equal: null,
        createById_equal: userId,
        name_equal: name,
      })
    ) {
      throw new ProductAlreadyExistedError(name);
    }

    const thumbnailMedia = await this.mediaService.findOneBasic({
      id_equal: thumbnailMediaId,
      createById_equal: userId,
    });
    if (!thumbnailMedia) throw new ThumbnailMediaNotFoundError();
    input.thumbnailMedia = thumbnailMedia;

    if (displayMediaIds) {
      const displayMedias = await this.mediaService.findManyBasic({
        id_in: displayMediaIds,
        createById_equal: userId,
      });
      if (displayMedias.length !== displayMediaIds.length) {
        throw new DisplayMediasNotFoundError();
      }
    }

    if (
      categoryId &&
      !(await this.categoryService.findOneBasic({
        id_equal: categoryId,
      }))
    ) {
      throw new CategoryNotFoundError();
    }

    if (types && types.length) {
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

    return {
      ...input,
      createById: userId,
      slugs: transformTextToSlugs(name),
    };
  }

  async validateUpdateProductInputData(
    input: UpdateProductInput,
    { userId }: JWTData,
  ): Promise<void> {
    const { name, categoryId, types, availableQuantity } = input;
    const productId = input.id;
    const product = await this.productService.findOneBasic({
      deletedAt_equal: null,
      createById_equal: userId,
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
        createById_equal: userId,
        name_equal: name,
      }))
    ) {
      throw new ProductAlreadyExistedError(name);
    }

    if (
      categoryId &&
      product?.categoryId &&
      categoryId !== product?.categoryId?.toString() &&
      !(await this.categoryService.findOneBasic({
        id_equal: categoryId,
      }))
    ) {
      throw new CategoryNotFoundError();
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
