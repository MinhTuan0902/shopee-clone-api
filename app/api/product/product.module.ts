import { AuthModule } from '@api/auth/auth.module';
import { CategoryModule } from '@api/category/category.module';
import { MediaModule } from '@api/media/media.module';
import { UserModule } from '@api/user/user.module';
import { Product, ProductSchema } from '@mongodb/entity/product/product.entity';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductFieldResolver } from './product-field.resolver';
import { ProductMutationResolver } from './product-mutation.resolver';
import { ProductQueryResolver } from './product-query.resolver';
import { ProductService } from './product.service';
import { ProductInputValidator } from './validator/product-input.validator';

@Module({
  imports: [
    CategoryModule,
    MediaModule,

    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),

    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  providers: [
    // Services
    ProductService,

    // Resolvers
    ProductMutationResolver,
    ProductQueryResolver,
    ProductFieldResolver,

    // Validators
    ProductInputValidator,
  ],
  exports: [ProductService],
})
export class ProductModule {}
