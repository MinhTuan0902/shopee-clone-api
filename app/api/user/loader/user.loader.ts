import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import DataLoader from 'dataloader';
import { Model } from 'mongoose';
import { NestDataLoader } from 'nestjs-dataloader/dist';

@Injectable()
export class UserLoader implements NestDataLoader<string, User> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  generateDataLoader(): DataLoader<string, User> {
    return new DataLoader<string, User>((ids: string[]) =>
      this.userModel.find({ _id: { $in: ids } }),
    );
  }
}
