import { JWTData } from '@api/auth/type/jwt-data.type';
import { CategoryService } from '@api/category/category.service';
import { CategoryNotFoundError } from '@api/category/error/category.error';
import { MediaService } from '@api/media/media.service';
import { Injectable } from '@nestjs/common';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import {
  DisplayMediasNotFoundError,
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
    const { name, categoryId, thumbnailMediaId, displayMediaIds } = input;
    if (
      await this.productService.findOneBasic({
        deletedAt_equal: null,
        createById_equal: userId,
        name_equal: name,
      })
    ) {
      throw new ProductAlreadyExistedError();
    }

    if (
      !(await this.mediaService.findOneBasic({
        id_equal: thumbnailMediaId,
        createById_equal: userId,
      }))
    ) {
      throw new ThumbnailMediaNotFoundError();
    }

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

    return {
      ...input,
      createById: userId,
    };
  }

  async validateUpdateProductInputData(
    input: UpdateProductInput,
    { userId }: JWTData,
  ): Promise<void> {
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
      input?.name &&
      input?.name !== product.name &&
      (await this.productService.findOneBasic({
        deletedAt_equal: null,
        createById_equal: userId,
        name_equal: input?.name,
      }))
    ) {
      throw new ProductAlreadyExistedError();
    }

    if (
      input?.categoryId &&
      product?.categoryId &&
      input?.categoryId !== product?.categoryId?.toString() &&
      !(await this.categoryService.findOneBasic({
        id_equal: input?.categoryId,
      }))
    ) {
      throw new CategoryNotFoundError();
    }

    if (
      input?.thumbnailMediaId &&
      input?.thumbnailMediaId !== product.thumbnailMediaId.toString() &&
      !(await this.mediaService.findOneBasic({
        createById_equal: userId,
        id_equal: input?.thumbnailMediaId,
      }))
    ) {
      throw new ThumbnailMediaNotFoundError();
    }
  }
}
