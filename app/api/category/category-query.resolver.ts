import { Category } from '@mongodb/entity/category/category.entity';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { isMongoId } from 'class-validator';
import { CategoryService } from './category.service';
import { CategoryNotFoundError } from './error/category.error';

@Resolver()
export class CategoryQueryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => Category, { nullable: true })
  category(@Args('id') id: string) {
    if (!isMongoId(id)) {
      throw new CategoryNotFoundError();
    }
    return this.categoryService.findOneBasic({ id_equal: id });
  }

  @Query(() => [Category])
  categories(): Promise<Category[]> {
    return this.categoryService.findManyBasic({});
  }
}
