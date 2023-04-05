import { NotificationType } from '@mongodb/entity/notification/enum/notification-type.enum';
import { NotificationSendType } from '@mongodb/entity/notification/enum/send-type.enum';
import {
  NotificationHighlight,
  NotificationMessage,
} from '@mongodb/entity/notification/notification.entity';

export class CreateNotificationInput {
  type: NotificationType;
  messages: NotificationMessage[];
  sendType: NotificationSendType;

  key?: string;
  highlights?: NotificationHighlight[];
  specificReceiverId?: string;
  receiverIds?: string[];
  stringVariables?: string;
}
