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

  /**
   * Notifications can be override will have this field
   */
  key?: string;
  highlights?: NotificationHighlight[];
  stringVariables?: string;
}

export class CreateSpecificReceiverNotificationInput extends CreateNotificationInput {
  specificReceiverId: string;
  wasReadBySpecificReceiver: boolean;
  key: string;
}
