import { IService } from '@interface/service.interface';
import {
  Category,
  CategoryDocument,
} from '@mongodb/entity/category/category.entity';
import { MongoFindOperatorProcessor } from '@mongodb/find-operator/find-operator-processor';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterCategoryInput } from './dto/filter-category.input';

@Injectable()
export class CategoryService implements IService {
  private mongoFindOperatorProcessor: MongoFindOperatorProcessor =
    new MongoFindOperatorProcessor();
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async findOneBasic(input: FilterCategoryInput): Promise<Category> {
    return this.categoryModel.findOne(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }
}
