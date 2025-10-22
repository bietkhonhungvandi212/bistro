import { PartialType, PickType } from '@nestjs/swagger';
import { FeedbackCreateREQ } from './feedback-create.request';

export class FeedbackUpdateREQ extends PartialType(
  PickType(FeedbackCreateREQ, ['courseRating', 'mentorRating', 'courseReview', 'mentorReview']),
) {}
