import { Resolver } from '@nestjs/graphql';

@Resolver()
export class OrderQueryResolver {
  constructor() {}

  async getOrderDetail() {}
  async getOrders() {}

  async cmsGetOrderDetail() {}
  async cmsGetOrders() {}
}
