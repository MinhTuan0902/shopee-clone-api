import {
  Category,
  CategorySchema,
} from '@mongodb/entity/category/category.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';

@Module({
  imports: [
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
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
