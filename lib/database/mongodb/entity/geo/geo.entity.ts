import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { GeoType } from './enum/geo-type.enum';

@Schema({ collection: 'Geo', _id: false })
@ObjectType()
export class Geo {
  @Prop({ type: String, enum: GeoType })
  @Field(() => GeoType)
  type: GeoType;

  @Prop({ type: Number })
  @Field(() => Int)
  level: number;

  @Prop({ type: String })
  @Field(() => String)
  id: string;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  parentId?: string;

  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: String })
  @Field(() => String)
  code: string;
}
