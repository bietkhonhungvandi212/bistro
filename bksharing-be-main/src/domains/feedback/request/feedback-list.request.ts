import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { PaginationREQ } from 'src/shared/generics/pagination.request';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { FeedbackRelation } from '../shared/type';

export class FeedbackListREQ extends PaginationREQ {
  @IdValidator()
  @Transform(({ value }) => value && parseInt(value))
  relationId: number;

  @IsEnum(FeedbackRelation)
  relationType: FeedbackRelation;
}
