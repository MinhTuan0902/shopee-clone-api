import { Role } from '@entity/user/enum';

export class JWTData {
  userId: string;
  roles: Role[];
  email?: string;
  phoneNumber?: string;
}
