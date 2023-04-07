import { AuthModule } from '@api/auth/auth.module';
import {
  Notification,
  NotificationSchema,
} from '@mongodb/entity/notification/notification.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationFieldResolver } from './notification-field.resolver';
import { NotificationMutationResolver } from './notification-mutation.resolver';
import { NotificationQueryResolver } from './notification-query.resolver';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    // Resolvers
    NotificationMutationResolver,
    NotificationQueryResolver,
    NotificationFieldResolver,

    // Services
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
