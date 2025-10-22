import { ReportClientFeedbackCreateREQ } from '../request/report-client-feedback-create.request';
import { ReportClientSubscriptionCreateREQ } from '../request/report-client-subscription-create.request';

function getRelationId(body: ReportClientSubscriptionCreateREQ | ReportClientFeedbackCreateREQ): number {
  if ('subscriptionId' in body) return body.subscriptionId;
  if ('feedbackId' in body) return body.feedbackId;

  throw new Error('Unable to resolve relationId: invalid DTO structure');
}
