import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class FeedbackCreateREQ {
  @Min(1)
  @Max(5)
  @IsNumber()
  mentorRating: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  courseRating: number;

  @IdValidator()
  subscriptionId: number;

  @IsString()
  @IsOptional()
  courseReview?: string;

  @IsString()
  @IsOptional()
  mentorReview?: string;
}
