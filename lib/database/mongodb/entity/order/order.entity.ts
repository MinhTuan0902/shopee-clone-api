import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { BaseEntity } from '../base.entity';
import { Media } from '../media/media.entity';
import { OrderStatus } from './enum/order-status.enum';

@ObjectType()
export class ProductInOrder {
  @Field(() => ID)
  _id: string;

  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID)
  createById: string;

  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: MongoSchema.Types.Mixed })
  @Field(() => Media)
  thumbnailMedia: Media;

  @Prop({ type: Number })
  @Field(() => Int)
  originalPrice: number;

  @Prop({ type: Number })
  @Field(() => Int, { nullable: true })
  salePrice?: number;
}

@ObjectType()
export class OrderDetail {
  @Prop({ type: MongoSchema.Types.Mixed })
  @Field(() => ProductInOrder)
  product: ProductInOrder;

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
        product: {
          _id: { type: MongoSchema.Types.ObjectId },
          createById: { type: MongoSchema.Types.ObjectId },
          name: { type: String },
          thumbnailMedia: { type: MongoSchema.Types.Mixed },
          originalPrice: { type: Number },
          salePrice: { type: Number },
        },
        type: { type: String },
        quantity: { type: Number },
      },
    ],
    _id: false,
  })
  @Field(() => [OrderDetail])
  details: OrderDetail[];

  // shippingAddress: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Pending })
  @Field(() => OrderStatus)
  status: OrderStatus;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
