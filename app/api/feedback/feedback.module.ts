import { AuthModule } from '@api/auth/auth.module';
import { OrderModule } from '@api/order/order.module';
import { ProductModule } from '@api/product/product.module';
import {
  Feedback,
  FeedbackSchema,
} from '@mongodb/entity/feedback/feedback.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackMutationResolver } from './feedback-mutation.resolver';
import { FeedbackService } from './feedback.service';
import { MediaModule } from '@api/media/media.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    OrderModule,
    MediaModule,

    MongooseModule.forFeature([
      {
        name: Feedback.name,
        schema: FeedbackSchema,
      },
    ]),
  ],
  providers: [
    // Resolvers
    FeedbackMutationResolver,

    // Services
    FeedbackService,
  ],
})
export class FeedbackModule {}
