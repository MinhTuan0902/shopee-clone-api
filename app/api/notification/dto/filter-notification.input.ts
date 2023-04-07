import { Field, InputType } from '@nestjs/graphql';
import { ReadNotificationType } from '../enum/read-notification-type.enum';

@InputType()
export class FilterNotificationInput {
  @Field(() => ReadNotificationType, { defaultValue: ReadNotificationType.All })
  readNotificationType: ReadNotificationType;
}
