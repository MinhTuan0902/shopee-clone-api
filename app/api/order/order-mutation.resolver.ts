import { ActualRoles } from '@api/auth/decorator/actual-role.decorator';
import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { ActualRolesGuard } from '@api/auth/guard/actual-role.guard';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { AddressValidator } from '@api/geo/validator/address.validator';
import {
  ProductNotFoundError,
  ProductSoldOutError,
  ProductTypeNotFoundError,
} from '@api/product/error/product.error';
import { ProductService } from '@api/product/product.service';
import { Order } from '@mongodb/entity/order/order.entity';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateOrderService } from '@worker/order/create/create-order.service';
import { CreateOrderInput } from './dto/create-order.input';
import {
  InvalidProductTypeError,
  OrderedProductQuantityLargerThanAvailableError,
  TooManyDistinctSellerError,
} from './error/order.error';
import { OrderService } from './order.service';

@Resolver()
export class OrderMutationResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly addressValidator: AddressValidator,
    private readonly createOrderService: CreateOrderService,
  ) {}

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Seller)
  @Mutation(() => Order)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() { userId }: JWTData,
  ): Promise<Order> {
    const { details, shippingAddressInput } = input;
    let sellerId: string;
    let totalCost = 0;

    /**
     * A product often has many types, and each type can have a specific @originalPrice and @salePrice
     * So we have to calculate the @totalCost in case if user's input has a specific product type
     */
    for (let i = 0; i < details.length; i++) {
      const { productId, type, quantity } = details[i];
      const product = await this.productService.findOneBasic({
        id_equal: productId,
      });
      if (!product) {
        throw new ProductNotFoundError();
      }
      if (!sellerId) {
        sellerId = product?.createById?.toString();
      }
      if (sellerId && sellerId !== product?.createById?.toString()) {
        throw new TooManyDistinctSellerError();
      }
      if (product.availableQuantity === 0) {
        throw new ProductSoldOutError(product.name);
      }
      if (product.availableQuantity < quantity) {
        throw new OrderedProductQuantityLargerThanAvailableError();
      }
      if (!type && product?.types?.length) {
        throw new InvalidProductTypeError();
      }

      let productPrice = 0;
      if (type) {
        if (!product?.types?.length) {
          throw new InvalidProductTypeError();
        }
        let productType: string;
        for (let i = 0; i < product?.types?.length; i++) {
          const productTypeDB = product?.types[i];
          if (productTypeDB.name === type) {
            if (product?.types[i].availableQuantity === 0) {
              throw new ProductSoldOutError(`${product.name} (${type})`);
            }
            if (product?.types[i].availableQuantity < quantity) {
              throw new OrderedProductQuantityLargerThanAvailableError();
            }
            productType = type;
            productPrice =
              product?.types[i]?.salePrice * quantity ||
              product?.types[i].originalPrice * quantity;
            break;
          }
        }
        if (!productType) {
          throw new ProductTypeNotFoundError();
        }
      } else {
        productPrice =
          product?.salePrice * quantity || product.originalPrice * quantity;
      }

      totalCost += productPrice;
      input.details[i].product = product;
    }

    const shippingAddress = await this.addressValidator.validateAddressInput(
      shippingAddressInput,
    );

    this.createOrderService.addCreateOrderPayloadToQueue({ sellerId });

    return this.orderService.createOne({
      ...input,
      createById: userId,
      shippingAddress,
      totalCost,
    });
  }
}
