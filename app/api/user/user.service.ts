import { RegisterInput } from '@api/auth/dto/register.input';
import { IService } from '@interface/service.interface';
import { UserStatus } from '@mongodb/entity/user/enum/user-status.enum';
import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

export class UserService implements IService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  isDisabledUser(user: User): boolean {
    return user && user.status === UserStatus.Disabled;
  }

  isDeletedUser(user: User): boolean {
    return user && user?.deletedAt !== null;
  }

  createOne(input: RegisterInput, session?: ClientSession): Promise<User> {
    if (session) {
      return this.userModel.create([{ ...input }], { session })[0];
    }

    return this.userModel.create({ ...input });
  }
}
