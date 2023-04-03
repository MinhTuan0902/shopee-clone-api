import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { Locale } from '@mongodb/entity/user/enum/locale.enum';
import { Role } from '@mongodb/entity/user/enum/role.enum';

export class JWTData {
  userId: string;
  roles: Role[];
  actualRole: ActualRole;
  refreshToken: string;
  locale: Locale;
  phoneNumber: string;
  email?: string;
}
