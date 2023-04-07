import { Roles } from '@api/auth/decorator/roles.decorator';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { RolesGuard } from '@api/auth/guard/roles.guard';
import { Category } from '@mongodb/entity/category/category.entity';
import { Role } from '@mongodb/entity/user/enum/role.enum';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import {
  CategoryAlreadyExistedError,
  CategoryNotFoundError,
} from './error/category.error';

@Resolver()
export class CategoryMutationResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(Role.Admin)
  @Mutation(() => Category)
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<Category> {
    const { name } = input;
    if (await this.categoryService.findOneBasic({ name_equal: name })) {
      throw new CategoryAlreadyExistedError(name);
    }

    return this.categoryService.createOne(input);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async updateCategory(
    @Args('input') input: UpdateCategoryInput,
  ): Promise<boolean> {
    const { id, name } = input;
    const category = await this.categoryService.findOneBasic({ id_equal: id });
    if (!category) {
      throw new CategoryNotFoundError();
    }

    if (
      name &&
      name !== category.name &&
      (await this.categoryService.findOneBasic({ name_equal: name }))
    ) {
      throw new CategoryAlreadyExistedError(name);
    }

    return this.categoryService.updateOne(input);
  }
}
