import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { SetMetadata } from '@nestjs/common';

export const ACTUAL_ROLE_KEY = 'actualRole';
export const ActualRoles = (...actualRole: ActualRole[]) =>
  SetMetadata(ACTUAL_ROLE_KEY, actualRole);
