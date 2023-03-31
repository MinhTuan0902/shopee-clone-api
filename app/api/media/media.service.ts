import { IService } from '@interface/service.interface';
import { Media, MediaDocument } from '@mongodb/entity/media/media.entity';
import { MongoFindOperatorProcessor } from '@mongodb/find-operator/find-operator-processor';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { FilterMediaInput } from './dto/filter-media.input';

@Injectable()
export class MediaService implements IService {
  private mongoFindOperatorProcessor: MongoFindOperatorProcessor =
    new MongoFindOperatorProcessor();
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async findOneBasic(input: FilterMediaInput): Promise<Media> {
    return this.mediaModel.findOne(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }

  async findManyBasic(input: FilterMediaInput): Promise<Media[]> {
    return this.mediaModel.find(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }
}
