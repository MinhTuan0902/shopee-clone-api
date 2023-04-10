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
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  UpdateFavoriteCategoriesInput,
  UpdateFavoriteProductsInput,
} from './dto/update-user.input';
import { UserService } from './user.service';

@Resolver()
export class UserMutationResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
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

    return this.userService.updateFavoriteCategories(userId, categories);
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

    return this.userService.updateFavoriteProducts(userId, products);
  }
}
