import { ActualRole } from '@entity/user/enum';
import { SetMetadata } from '@nestjs/common';

export const ACTUAL_ROLE_KEY = 'actualRole';
export const ActualRoles = (...actualRole: ActualRole[]) =>
  SetMetadata(ACTUAL_ROLE_KEY, actualRole);
