import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { BaseEntity } from '../base.entity';
import { Product } from '../product/product.entity';
import { OrderStatus } from './enum/order-status.enum';

@ObjectType()
export class ProductInOrder extends Product {
  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID)
  sellerId: string;

  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: Number })
  @Field(() => Int)
  originCost: number;

  @Prop({ type: Number })
  @Field(() => Int, { nullable: true })
  saleCost?: number;
}

@ObjectType()
export class OrderDetail {
  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID)
  product: string;

  @Prop({ type: Number })
  @Field(() => Int)
  quantity: number;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  size?: string;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  color?: string;
}

@Schema({ timestamps: true, collection: 'Order' })
@ObjectType()
export class Order extends BaseEntity {
  @Prop({ type: Array<MongoSchema.Types.Mixed> })
  @Field(() => OrderDetail)
  details: OrderDetail[];

  @Prop({ type: String, enum: OrderStatus })
  @Field(() => OrderStatus)
  status: OrderStatus;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
