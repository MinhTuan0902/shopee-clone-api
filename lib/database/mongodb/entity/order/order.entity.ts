import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Address } from '../address/address.entity';
import { BaseEntity } from '../base.entity';
import { Product } from '../product/product.entity';
import { Transporter } from '../transporter/transporter.entity';
import { OrderStatus } from './enum/order-status.enum';

@ObjectType()
export class OrderDetail {
  @Prop({ type: MongoSchema.Types.Mixed })
  @Field(() => Product)
  product: Product;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  type?: string;

  @Prop({ type: Number })
  @Field(() => Int)
  quantity: number;
}

@Schema({ timestamps: true, collection: 'Order' })
@ObjectType()
export class Order extends BaseEntity {
  @Prop({
    type: [
      {
        product: { type: MongoSchema.Types.Mixed },
        type: { type: String },
        quantity: { type: Number },
      },
    ],
    _id: false,
  })
  @Field(() => [OrderDetail])
  details: OrderDetail[];

  @Prop({ type: MongoSchema.Types.Mixed })
  @Field(() => Address)
  shippingAddress: Address;

  @Prop({ type: Number })
  @Field(() => Number)
  totalCost: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Processing })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @Prop({ type: MongoSchema.Types.Mixed })
  @Field(() => Transporter, { nullable: true })
  transporter?: Transporter;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
