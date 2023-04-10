import { ActualRoles } from '@api/auth/decorator/actual-role.decorator';
import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { ActualRolesGuard } from '@api/auth/guard/actual-role.guard';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { CategoryService } from '@api/category/category.service';
import { CategoryNotFoundError } from '@api/category/error/category.error';
import { ProductService } from '@api/product/product.service';
import { ParseMongoIdPipe } from '@common/pipe/parse-mongo-id.pipe';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateFavoriteCategoriesInput } from './dto/update-user.input';
import { UserNotFoundError } from './error/user.error';
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

  @UseGuards(JWTGuard)
  @Mutation(() => Boolean)
  async followUser(
    @Args('userId', ParseMongoIdPipe) userId: string,
    @CurrentUser() currentUser: JWTData,
  ): Promise<boolean> {
    if (userId === currentUser.userId) {
      return false;
    }

    const user = await this.userService.findOneBasic({
      id_equal: userId,
      deletedAt_equal: null,
    });
    if (!user) {
      throw new UserNotFoundError();
    }

    return this.userService.followUser(currentUser.userId, userId);
  }

  @UseGuards(JWTGuard)
  @Mutation(() => Boolean)
  async unFollowUser(
    @Args('userId', ParseMongoIdPipe) userId: string,
    @CurrentUser() currentUser: JWTData,
  ): Promise<boolean> {
    return this.userService.unFollowUser(currentUser.userId, userId);
  }
}
