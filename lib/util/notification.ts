import { CreateOrderNotificationVariable } from '@interface/notification-variable.interface';
import { NotificationType } from '@mongodb/entity/notification/enum/notification-type.enum';
import { Locale } from '@mongodb/entity/user/enum/locale.enum';

export function processNotificationMessage(
  type: NotificationType,
  locale: Locale,
  stringVariables?: string,
): string {
  let content: string;
  switch (type) {
    case NotificationType.OrderCreated:
      const { totalOrder } = JSON.parse(
        stringVariables,
      ) as CreateOrderNotificationVariable;
      const haveManyOrder = totalOrder === 1 ? false : true;
      if (locale === Locale.EnglishUS) {
        content = `You have ${totalOrder} new ${
          haveManyOrder ? 'orders' : 'order'
        } that needs to be processed. Check now 📦`;
      }
      if (locale === Locale.Vietnamese) {
        content = `Bạn có ${totalOrder} đơn hàng mới cần được xử lý. Kiểm tra ngay 📦`;
      }
      break;

    default:
      break;
  }

  return content;
}
