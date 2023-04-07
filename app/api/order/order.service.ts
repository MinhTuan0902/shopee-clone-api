import { IService } from '@common/interface/service.interface';
import { Order, OrderDocument } from '@mongodb/entity/order/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreateOrderInput } from './dto/create-order.input';
import { MongoFindOperatorProcessor } from '@mongodb/find-operator/find-operator-processor';
import { FilterOrderInput } from './dto/query-order.input';

@Injectable()
export class OrderService implements IService {
  private mongoFindOperatorProcessor: MongoFindOperatorProcessor =
    new MongoFindOperatorProcessor();
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  createOne(input: CreateOrderInput, session?: ClientSession): Promise<Order> {
    return session
      ? this.orderModel.create([{ ...input }], { session })[0]
      : this.orderModel.create({ ...input });
  }

  findManyBasic(input: FilterOrderInput): Promise<Order[]> {
    return this.orderModel.find(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }
}
