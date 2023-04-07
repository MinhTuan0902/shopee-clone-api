import { CreateOrderNotificationVariable } from '@api/notification/interface/notification-variable.interface';
import { NotificationType } from '@mongodb/entity/notification/enum/notification-type.enum';
import { Locale } from '@mongodb/entity/user/enum/locale.enum';

/**
 *
 * @param type The notification type to get suitable message
 * @param locale The locale to get suitable message
 * @param stringVariables It contains the variables, needed to be parsed by using `JSON.parse()`
 * @returns A notification message
 */
// TODO: Config I18n to get suitable message
export function processNotificationMessage(
  type: NotificationType,
  locale: Locale,
  stringVariables?: string,
): string {
  let message: string;
  switch (type) {
    case NotificationType.OrderCreated:
      const { totalOrder } = JSON.parse(
        stringVariables,
      ) as CreateOrderNotificationVariable;
      const haveManyOrder = totalOrder === 1 ? false : true;
      if (locale === Locale.EnglishUS) {
        message = `You have ${totalOrder} new ${
          haveManyOrder ? 'orders' : 'order'
        } that needs to be processed. Check now 📦`;
      }
      if (locale === Locale.Vietnamese) {
        message = `Bạn có ${totalOrder} đơn hàng mới cần được xử lý. Kiểm tra ngay 📦`;
      }
      break;

    default:
      break;
  }

  return message;
}
