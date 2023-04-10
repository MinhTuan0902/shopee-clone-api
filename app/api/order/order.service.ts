import { IService } from '@common/interface/service.interface';
import { Order, OrderDocument } from '@mongodb/entity/order/order.entity';
import { MongoFindOperatorProcessor } from '@mongodb/find-operator/find-operator-processor';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PipelineStage } from 'mongoose';
import { CreateOrderInput } from './dto/create-order.input';
import { FilterOrderInput } from './dto/filter-order.input';

@Injectable()
export class OrderService implements IService {
  private mongoFindOperatorProcessor: MongoFindOperatorProcessor =
    new MongoFindOperatorProcessor();
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createOne(
    input: CreateOrderInput,
    session?: ClientSession,
  ): Promise<Order> {
    return session
      ? this.orderModel.create([{ ...input }], { session })[0]
      : this.orderModel.create({ ...input });
  }

  async findManyBasic(input: FilterOrderInput): Promise<Order[]> {
    return this.orderModel.find(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }

  async findOneByPipelines(pipelines: PipelineStage[]): Promise<any> {
    return this.orderModel.aggregate(pipelines);
  }
}
