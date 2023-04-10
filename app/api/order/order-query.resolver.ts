import { ActualRoles } from '@api/auth/decorator/actual-role.decorator';
import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { ActualRolesGuard } from '@api/auth/guard/actual-role.guard';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Order } from '@mongodb/entity/order/order.entity';
import { OrderService } from './order.service';

@Resolver()
export class OrderQueryResolver {
  constructor(private readonly orderService: OrderService) {}

  async getOrderDetail() {}

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Customer)
  @Query(() => [Order])
  async getMyOrders(@CurrentUser() { userId }: JWTData) {
    return this.orderService.findManyBasic({ createByUserId_equal: userId });
  }

  async cmsGetOrderDetail() {}
  async cmsGetOrders() {}
}
