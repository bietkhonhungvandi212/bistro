import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class SubscriptionMentorApproveREQ {
  @IdValidator()
  subscriptionId: number;

  @BooleanValidator()
  isApproved: boolean;
}
