import {
  Category,
  CategorySchema,
} from '@mongodb/entity/category/category.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryQueryResolver } from './category-query.resolver';
import { CategoryService } from './category.service';
import { CategoryMutationResolver } from './category-mutation.resolver';
import { AuthModule } from '@api/auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
