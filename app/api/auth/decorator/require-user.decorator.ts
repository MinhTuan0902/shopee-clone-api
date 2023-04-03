import { Role } from '@mongodb/entity/user/enum/role.enum';
import { applyDecorators } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { JWTGuard } from '../guard/jwt.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';

export function RequireUser(roles: Role[] = [Role.User]) {
  return applyDecorators(UseGuards(JWTGuard, RolesGuard), Roles(...roles));
}
