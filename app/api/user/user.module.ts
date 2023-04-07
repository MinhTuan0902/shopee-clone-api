import { AuthModule } from '@api/auth/auth.module';
import { CategoryModule } from '@api/category/category.module';
import { ProductModule } from '@api/product/product.module';
import { User, UserSchema } from '@mongodb/entity/user/user.entity';
import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common/decorators';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLoader } from './loader/user.loader';
import { UserFieldResolver } from './user-field.resolver';
import { UserMutationResolver } from './user-mutation.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    CategoryModule,

    forwardRef(() => AuthModule),
    forwardRef(() => ProductModule),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    // Resolvers
    UserMutationResolver,
    UserFieldResolver,

    // Services
    UserService,

    // Loaders
    UserLoader,
  ],
  exports: [UserService, UserLoader],
})
export class UserModule {}
