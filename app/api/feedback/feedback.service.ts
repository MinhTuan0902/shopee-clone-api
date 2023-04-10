import {
  Feedback,
  FeedbackDocument,
} from '@mongodb/entity/feedback/feedback.entity';
import { MongoFindOperatorProcessor } from '@mongodb/find-operator/find-operator-processor';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { FilterFeedbackInput } from './dto/filter-feedback.input';

@Injectable()
export class FeedbackService {
  private mongoFindOperatorProcessor: MongoFindOperatorProcessor =
    new MongoFindOperatorProcessor();
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<FeedbackDocument>,
  ) {}

  async createOne(input: CreateFeedbackInput) {
    return this.feedbackModel.create(input);
  }

  async findOneBasic(input: FilterFeedbackInput): Promise<Feedback> {
    return this.feedbackModel.findOne(
      this.mongoFindOperatorProcessor.convertInputFilterToMongoFindOperator(
        input,
      ),
    );
  }
}
