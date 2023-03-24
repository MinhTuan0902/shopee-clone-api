import { ActualRole, Role } from '@entity/user/enum';

export class JWTData {
  userId: string;
  roles: Role[];
  actualRole: ActualRole;
  email?: string;
  phoneNumber?: string;
}
