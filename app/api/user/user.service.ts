import { RegisterInput } from '@api/auth/dto/register.input';
import { IService } from '@common/interface/service.interface';
import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { MongoFindOperatorProcessor } from '@mongodb/find-operator/find-operator-processor';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { FilterUserInput } from './dto/filter-user.input';

export class UserService implements IService {
  private mongoFindOperatorProcessor: MongoFindOperatorProcessor =
    new MongoFindOperatorProcessor();
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createOne(
    input: RegisterInput,
    session?: ClientSession,
  ): Promise<User> {
    if (session) {
      return this.userModel.create([{ ...input }], { session })[0];
    }

    return this.userModel.create({ ...input });
  }

  async findOneBasic(input: FilterUserInput): Promise<User> {
    return this.userModel.findOne(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }

  async updatePassword(userId: string, password): Promise<boolean> {
    const { matchedCount, modifiedCount } = await this.userModel.updateOne(
      { _id: userId },
      { $set: { password: password } },
    );

    return matchedCount === 1 && modifiedCount === 1;
  }
}
