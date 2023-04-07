import { AuthModule } from '@api/auth/auth.module';
import {
  Category,
  CategorySchema,
} from '@mongodb/entity/category/category.entity';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryMutationResolver } from './category-mutation.resolver';
import { CategoryQueryResolver } from './category-query.resolver';
import { CategoryService } from './category.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),

    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  providers: [
    // Services
    CategoryService,

    // Resolvers
    CategoryQueryResolver,
    CategoryMutationResolver,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
