import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { RequireUser } from '@api/auth/decorator/require-user.decorator';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { Category } from '@mongodb/entity/category/category.entity';
import { Role } from '@mongodb/entity/user/enum/role.enum';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { transformTextToSlugs } from '@util/string';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import {
  CategoryAlreadyExistedError,
  CategoryNotFoundError,
} from './error/category.error';
import { isMongoId } from 'class-validator';

@Resolver()
export class CategoryMutationResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @RequireUser([Role.Admin])
  @Mutation(() => Category)
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<Category> {
    const { name } = input;
    if (await this.categoryService.findOneBasic({ name_equal: name })) {
      throw new CategoryAlreadyExistedError(name);
    }

    return this.categoryService.createOne({
      ...input,
      slugs: transformTextToSlugs(name),
    });
  }

  @RequireUser([Role.Admin])
  @Mutation(() => Boolean)
  async updateCategory(
    @Args('input') input: UpdateCategoryInput,
  ): Promise<boolean> {
    const { id, name } = input;
    if (!isMongoId(id)) throw new CategoryNotFoundError();
    const category = await this.categoryService.findOneBasic({ id_equal: id });
    if (!category) throw new CategoryNotFoundError();

    if (
      name &&
      name !== category.name &&
      (await this.categoryService.findOneBasic({ name_equal: name }))
    ) {
      throw new CategoryAlreadyExistedError(name);
    }

    await this.categoryService.updateOne({
      ...input,
      slugs: name ? transformTextToSlugs(name) : undefined,
    });

    return true;
  }
}
