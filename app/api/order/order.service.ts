import { IService } from '@interface/service.interface';
import { Order, OrderDocument } from '@mongodb/entity/order/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrderService implements IService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  createOne(input: CreateOrderInput, session?: ClientSession): Promise<Order> {
    return session
      ? this.orderModel.create([{ ...input }], { session })[0]
      : this.orderModel.create({ ...input });
  }
}
