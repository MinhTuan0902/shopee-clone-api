import { ActualRoles } from '@api/auth/decorator/actual-role.decorator';
import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { ActualRolesGuard } from '@api/auth/guard/actual-role.guard';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { Product } from '@mongodb/entity/product/product.entity';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { isMongoId } from 'class-validator';
import { ProductNotFoundError } from './error/product.error';
import { ProductService } from './product.service';

@Resolver()
export class ProductQueryResolver {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Seller)
  @Query(() => [Product])
  async getMyProducts(@CurrentUser() { userId }: JWTData): Promise<Product[]> {
    return this.productService.findManyBasic({ createById_equal: userId });
  }

  @Query(() => Product)
  async getProductDetail(@Args('id') id: string): Promise<Product> {
    if (!isMongoId(id)) {
      throw new ProductNotFoundError();
    }
    const product = await this.productService.findOneBasic({ id_equal: id });
    if (!product) {
      throw new ProductNotFoundError();
    }

    return product;
  }

  async getSuggestedProducts() {}
}
