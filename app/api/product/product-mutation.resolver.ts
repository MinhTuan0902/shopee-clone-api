import { ActualRoles } from '@api/auth/decorator/actual-role.decorator';
import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { ActualRolesGuard } from '@api/auth/guard/actual-role.guard';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { Product } from '@mongodb/entity/product/product.entity';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { transformTextToSlugs } from '@util/string';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductService } from './product.service';
import { ProductInputValidator } from './validator/product-input.validator';

@Resolver()
export class ProductMutationResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly productInputValidator: ProductInputValidator,
  ) {}

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Seller)
  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: CreateProductInput,
    @CurrentUser() currentUser: JWTData,
  ): Promise<Product> {
    input = await this.productInputValidator.validateCreateProductInputData(
      input,
      currentUser,
    );
    return this.productService.createOne(input);
  }

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Seller)
  @Mutation(() => Boolean)
  async updateProduct(
    @Args('input') input: UpdateProductInput,
    @CurrentUser() currentUser: JWTData,
  ): Promise<boolean> {
    await this.productInputValidator.validateUpdateProductInputData(
      input,
      currentUser,
    );
    return this.productService.updateOne({
      ...input,
      slugs: input?.name ? transformTextToSlugs(input?.name) : undefined,
    });
  }

  async deleteProducts() {}
}
