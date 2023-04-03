import { IService } from '@interface/service.interface';
import {
  Product,
  ProductDocument,
} from '@mongodb/entity/product/product.entity';
import { MongoFindOperatorProcessor } from '@mongodb/find-operator/find-operator-processor';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductInput } from './dto/create-product.input';
import { FilterProductInput } from './dto/filter-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductService implements IService {
  private mongoFindOperatorProcessor: MongoFindOperatorProcessor =
    new MongoFindOperatorProcessor();
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  createOne(input: CreateProductInput): Promise<Product> {
    return this.productModel.create(input);
  }

  findOneBasic(input: FilterProductInput): Promise<Product> {
    return this.productModel.findOne(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }

  findManyBasic(input: FilterProductInput): Promise<Product[]> {
    return this.productModel.find(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }

  async updateOne(input: UpdateProductInput) {
    const id = input.id;
    delete input.id;
    await this.productModel.updateOne({ _id: id }, { $set: { ...input } });
  }
}
