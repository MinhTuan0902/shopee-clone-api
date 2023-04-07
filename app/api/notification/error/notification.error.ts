import { GraphQLNotFoundError } from '@common/error/graphql.error';

export class NotificationNotFoundError extends GraphQLNotFoundError {
  constructor() {
    super({
      messageCode: 'NOTIFICATION_NOT_FOUND',
      message: 'Notification is not found',
    });
    this.name = 'NotificationNotFoundError';
  }
}
