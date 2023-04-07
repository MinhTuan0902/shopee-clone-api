import { UserStatus } from '@mongodb/entity/user/enum/user-status.enum';
import { User } from '@mongodb/entity/user/user.entity';

export function isDisabledUser(user: User): boolean {
  return user.status === UserStatus.Disabled;
}
