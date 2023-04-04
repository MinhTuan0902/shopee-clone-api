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
import { Order, ProductInOrder } from '@mongodb/entity/order/order.entity';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
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
  ) {}

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Seller)
  @Mutation(() => Order)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() { userId, locale }: JWTData,
  ): Promise<Order> {
    const { details, shippingAddressInput } = input;
    let sellerId: string;
    for (let i = 0; i < details.length; i++) {
      const { productId, type, quantity } = details[i];
      const product = await this.productService.findOneBasic({
        id_equal: productId,
      });
      if (!product) throw new ProductNotFoundError();
      if (!sellerId) sellerId = product?.createById?.toString();
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

      if (type) {
        if (!product?.types?.length) throw new InvalidProductTypeError();
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
            break;
          }
        }
        if (!productType) throw new ProductTypeNotFoundError();
      }

      const productInOrder: ProductInOrder = {
        _id: product._id,
        name: product.name,
        originalPrice: product.originalPrice,
        salePrice: product?.salePrice,
        createById: product.createById,
        thumbnailMedia: product.thumbnailMedia,
      };
      input.details[i].product = productInOrder;
    }

    const shippingAddress = await this.addressValidator.validateAddressInput(
      shippingAddressInput,
    );

    return this.orderService.createOne({
      ...input,
      createById: userId,
      shippingAddress,
    });
  }
}
