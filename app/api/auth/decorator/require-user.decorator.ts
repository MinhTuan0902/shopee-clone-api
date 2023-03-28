import { Role } from '@entity/user/enum';
import { applyDecorators } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { JWTGuard, RolesGuard } from '../guard';
import { Roles } from './roles.decorator';

export function RequireUser() {
  return applyDecorators(UseGuards(JWTGuard, RolesGuard), Roles(Role.User));
}
