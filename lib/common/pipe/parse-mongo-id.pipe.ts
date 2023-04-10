import { GraphQLBadRequestError } from '@common/error/graphql.error';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || (value && !isMongoId(value))) {
      throw new GraphQLBadRequestError({
        messageCode: 'VALIDATION_ERROR',
        message: 'Provided value is not a valid Mong Id',
      });
    }

    return value;
  }
}
