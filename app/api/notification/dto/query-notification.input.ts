import { BaseQueryInput, QueryOption } from '@common/dto/base-query.input';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min, Validate, ValidateNested } from 'class-validator';
import { FilterNotificationInput } from './filter-notification.input';

@InputType()
export class QueryNotificationOption extends QueryOption {
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'limit must be an integer' },
  )
  @Min(1, { message: 'limit must at least be greater than or equal to 1' })
  @Max(20, { message: 'limit must be less than or equal to 20' })
  @Field(() => Int)
  limit: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'offset must be an integer' },
  )
  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}

@InputType()
export class QueryNotificationInput extends BaseQueryInput {
  @Field(() => FilterNotificationInput)
  filter: FilterNotificationInput;

  @Field(() => QueryNotificationOption)
  @ValidateNested()
  @Type(() => QueryNotificationOption)
  option: QueryNotificationOption;
}
