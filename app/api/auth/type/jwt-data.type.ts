import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { Role } from '@mongodb/entity/user/enum/role.enum';

export class JWTData {
  userId: string;
  roles: Role[];
  actualRole: ActualRole;
  refreshTokenId: string;
  email?: string;
  phoneNumber?: string;
}
