import { IService } from '@common/interface/service.interface';
import {
  Category,
  CategoryDocument,
} from '@mongodb/entity/category/category.entity';
import { MongoFindOperatorProcessor } from '@mongodb/find-operator/find-operator-processor';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryInput } from './dto/create-category.input';
import { FilterCategoryInput } from './dto/filter-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoryService implements IService {
  private mongoFindOperatorProcessor: MongoFindOperatorProcessor =
    new MongoFindOperatorProcessor();
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  createOne(input: CreateCategoryInput): Promise<Category> {
    return this.categoryModel.create(input);
  }

  async findOneBasic(input: FilterCategoryInput): Promise<Category> {
    return this.categoryModel.findOne(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }

  async findManyBasic(input: FilterCategoryInput): Promise<Category[]> {
    return this.categoryModel.find(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }

  async updateOne(input: UpdateCategoryInput): Promise<boolean> {
    const id = input.id;
    delete input.id;
    const { matchedCount, modifiedCount } = await this.categoryModel.updateOne(
      { _id: id },
      { $set: { ...input } },
    );
    return matchedCount === 1 && modifiedCount === 1;
  }
}
