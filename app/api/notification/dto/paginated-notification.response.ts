import { PaginatedItems } from '@common/dto/paginated-items.response';
import { Notification } from '@mongodb/entity/notification/notification.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedNotification extends PaginatedItems {
  @Field(() => [Notification])
  items: Notification[];
}
