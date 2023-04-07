import { ActualRoles } from '@api/auth/decorator/actual-role.decorator';
import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { ActualRolesGuard } from '@api/auth/guard/actual-role.guard';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { CategoryService } from '@api/category/category.service';
import { CategoryNotFoundError } from '@api/category/error/category.error';
import { ProductNotFoundError } from '@api/product/error/product.error';
import { ProductService } from '@api/product/product.service';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UpdateFavoriteCategoriesInput,
  UpdateFavoriteProductsInput,
} from './dto/update-user.input';

@Resolver()
export class UserMutationResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,

    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Customer)
  @Mutation(() => Boolean)
  async updateMyFavoriteCategories(
    @Args('input') { categoryIds }: UpdateFavoriteCategoriesInput,
    @CurrentUser() { userId }: JWTData,
  ): Promise<boolean> {
    const categories = await this.categoryService.findManyBasic({
      id_in: categoryIds,
    });
    if (categories.length !== categoryIds.length) {
      throw new CategoryNotFoundError();
    }

    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          favoriteCategories: categories,
        },
      },
    );

    return true;
  }

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Customer)
  @Mutation(() => Boolean)
  async updateMyFavoriteProducts(
    @Args('input') { productIds }: UpdateFavoriteProductsInput,
    @CurrentUser() { userId }: JWTData,
  ): Promise<boolean> {
    const products = await this.productService.findManyBasic({
      id_in: productIds,
      deletedAt_equal: null,
    });
    if (products.length !== productIds.length) {
      throw new ProductNotFoundError();
    }

    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          favoriteProducts: products,
        },
      },
    );

    return true;
  }
}
