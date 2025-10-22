import { Injectable, Logger } from '@nestjs/common';
import { AccountService } from 'src/domains/accounts/account.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { FeedbackListHelper } from '../helper/feedback-list.helper';
import { FeedbackListREQ } from '../request/feedback-list.request';
import { FeedbackGetPayload } from '../shared/type';

@Injectable()
export class FeedbackAdminService {
  private readonly logger: Logger = new Logger(FeedbackAdminService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly accountSevice: AccountService,
  ) {}

  async listByRelation(query: FeedbackListREQ) {
    const feedbacks = await this.transactionHost.tx.feedback.findMany(FeedbackListHelper.toFindMany(query));
    const count = await this.transactionHost.tx.feedback.count({ where: FeedbackListHelper.toQueryCondition(query) });

    const dtos = await Promise.all(
      feedbacks.map(async (feedback: FeedbackGetPayload) => {
        const reviewer = await this.accountSevice.getMe(feedback.reviewerId);

        return FeedbackListHelper.fromEntity(feedback, {
          id: reviewer.account.id,
          name: reviewer.account.name,
          thumbnail: reviewer.thumbnail,
        });
      }),
    );

    return { dtos, count };
  }

  async listAllFeedback(query) {}
}
