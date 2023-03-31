import { Prop, Schema } from '@nestjs/mongoose';
import { BaseEntity } from '../base.entity';

@Schema({ timestamps: true, collection: 'Migration' })
export class Migration extends BaseEntity {
  @Prop({ type: String })
  key: string;
}
