import { User, UserSchema } from '@mongodb/entity/user/user.entity';
import { Module } from '@nestjs/common/decorators';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLoader } from './loader/user.loader';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    // Services
    UserService,

    UserLoader,
  ],
  exports: [UserService, UserLoader],
})
export class UserModule {}
