import { ParseMongoIdPipe } from '@common/pipe/parse-mongo-id.pipe';
import { Category } from '@mongodb/entity/category/category.entity';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryNotFoundError } from './error/category.error';

@Resolver()
export class CategoryQueryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => Category)
  async category(@Args('id', ParseMongoIdPipe) id: string) {
    const category = await this.categoryService.findOneBasic({ id_equal: id });
    if (!category) {
      throw new CategoryNotFoundError();
    }

    return category;
  }

  @Query(() => [Category])
  categories(): Promise<Category[]> {
    return this.categoryService.findManyBasic({});
  }
}
