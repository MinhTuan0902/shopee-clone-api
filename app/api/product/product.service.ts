import { QueryOption } from '@common/dto/base-query.input';
import { IService } from '@common/interface/service.interface';
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

  async createOne(input: CreateProductInput): Promise<Product> {
    return this.productModel.create(input);
  }

  async findOneBasic(input: FilterProductInput): Promise<Product> {
    return this.productModel.findOne(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }

  async findManyBasic(
    input: FilterProductInput,
    option?: QueryOption,
  ): Promise<Product[]> {
    const limit = option ? option.limit : undefined;
    const offset = option ? option.offset : 0;
    return this.productModel
      .find(
        this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
          input,
        ),
      )
      .skip(offset)
      .limit(limit);
  }

  async updateOne(input: UpdateProductInput): Promise<boolean> {
    const id = input.id;
    delete input.id;
    const { matchedCount, modifiedCount } = await this.productModel.updateOne(
      { _id: id },
      { $set: { ...input } },
    );
    return matchedCount === 1 && modifiedCount === 1;
  }

  async likeProduct(userId: string, productId: string): Promise<boolean> {
    const { matchedCount, modifiedCount } = await this.productModel.updateOne(
      {
        _id: productId,
      },
      {
        $addToSet: {
          likeByUserIds: userId,
        },
      },
    );

    return matchedCount === 1 && modifiedCount === 1;
  }

  async unlikeProduct(userId: string, productId: string): Promise<boolean> {
    const { matchedCount, modifiedCount } = await this.productModel.updateOne(
      {
        _id: productId,
      },
      {
        $pull: {
          likeByUserIds: userId,
        },
      },
    );

    return matchedCount === 1 && modifiedCount === 1;
  }
}
