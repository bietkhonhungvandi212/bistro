import { Injectable, Logger } from '@nestjs/common';
import { ClickType, MentorStatus } from '@prisma/client';
import { AccountService } from 'src/domains/accounts/account.service';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { CourseClientService } from 'src/domains/course/client/course-client.service';
import { ImageService } from 'src/domains/image/image.service';
import { MentorClientDetailDTO } from 'src/domains/mentor/admin/dto/mentor-client-detail.dto';
import { MentorClientListREQ } from 'src/domains/mentor/admin/request/mentor-client-list.request';
import { MentorClientListRESP } from 'src/domains/mentor/admin/response/mentor-client-list.response';
import { MentorGetPayload } from 'src/domains/mentor/shared/types';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { AccountErrorMessages, MentorErrorMessages } from 'src/shared/messages/error-messages';
import { MentorClientAchievementCreateREQ } from './request/mentor-client-achievement-create.request';
import { MentorClientAchievementUpdateREQ } from './request/mentor-client-achievement-update.request';
import { MentorClientCourseListREQ } from './request/mentor-client-course-list.request';
import { MentorClientRecommendREQ } from './request/mentor-client-recommend.request';
import { MentorClientUpdateREQ } from './request/mentor-client-update.request';

@Injectable()
export class MentorClientService {
  private readonly logger = new Logger(MentorClientService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly accountService: AccountService,
    private readonly imageService: ImageService,
    private readonly courseClientService: CourseClientService,
  ) {}

  /* API: List All Mentor */
  async list(query: MentorClientListREQ) {
    const mentors = await this.transactionHost.tx.mentor.findMany(MentorClientListREQ.toFindMany(query));
    const count = await this.transactionHost.tx.mentor.count({ where: MentorClientListREQ.toQueryCondition(query) });

    const mentorsDTO = await Promise.all(
      mentors.map(async (mentor: MentorGetPayload) => {
        return await this.convertMentorToDTO(mentor);
      }),
    );

    return { mentorsDTO, count };
  }

  /* API: Get mentor recommendation */
  async getMentorsRecommendation(query: MentorClientRecommendREQ) {
    const mentors = (await this.transactionHost.tx.mentor.findMany(
      MentorClientRecommendREQ.toFindManyByAccountIds(query),
    )) as MentorGetPayload[];

    const mentorsDTO = await Promise.all(mentors.map((mentor) => this.convertMentorToDTO(mentor)));

    return { mentorsDTO };
  }

  private async convertMentorToDTO(mentor: MentorGetPayload): Promise<MentorClientListRESP> {
    const thumbnail = await this.imageService.getImageOriginal(mentor.Account.avatarId);
    const noOfSubscriptions = await this.transactionHost.tx.subscription.count({
      where: { Course: { creatorId: mentor.accountId } },
    });

    return MentorClientListRESP.fromEntity(
      mentor,
      {
        noOfSubscriptions,
        rateOfMentor: mentor.meanRates,
      },
      thumbnail,
    );
  }

  /* API: Update Mentor */
  async update(mentorId: number, user: AuthUserDTO, body: MentorClientUpdateREQ) {
    const mentor = await this.transactionHost.tx.mentor.findFirstOrThrow({
      where: { id: mentorId, accountId: user.accountId },
      select: { id: true, accountId: true },
    });

    if (!mentor) throw new ActionFailedException(ActionFailed.MENTOR_NOT_BELONG_TO_THIS_ACCOUNT, MentorErrorMessages.MSG02);

    await this.accountService.updateAccount(user, body);

    return mentor;
  }

  /* API: Update achievements by mentor id */
  async updateAchievements(mentorId: number, body: MentorClientAchievementUpdateREQ, user: AuthUserDTO) {
    const mentor = await this.transactionHost.tx.mentor.findFirst({
      where: { id: mentorId, accountId: user.accountId },
      select: { id: true, accountId: true },
    });

    if (!mentor) {
      throw new ActionFailedException(ActionFailed.MENTOR_NOT_FOUND, MentorErrorMessages.MSG04);
    }

    // Find all achievements of mentor by accountId
    const profileAchievements = await this.transactionHost.tx.profileAchievement.findMany({
      where: { accountId: mentor.accountId, type: body.achievementType },
      select: { id: true, isCurrent: true },
    });

    const profileAchievementIds = profileAchievements.map((item) => item.id);

    if (!profileAchievementIds.includes(body.id)) {
      throw new ActionFailedException(ActionFailed.MENTOR_PROFILE_ACHIEVEMENT_NOT_FOUND, MentorErrorMessages.MSG03);
    }

    const currentAchievement = profileAchievements.find((item) => item.isCurrent);

    if (body.isCurrent && currentAchievement && currentAchievement.id !== body.id) {
      await this.transactionHost.tx.profileAchievement.update({
        where: { id: currentAchievement.id },
        data: { isCurrent: false },
      });
    }

    const achievement = await this.transactionHost.tx.profileAchievement.update({
      where: { id: body.id },
      data: MentorClientAchievementUpdateREQ.ToUpdateByAchievementType(body),
      select: { id: true },
    });

    return { mentorId: mentor.id, achievementId: achievement.id };
  }

  /* API: Add achievements by mentor id */
  @Transactional(TRANSACTION_TIMEOUT)
  async addProfileAchievement(mentorId: number, body: MentorClientAchievementCreateREQ, user: AuthUserDTO) {
    const mentor = await this.transactionHost.tx.mentor.findUnique({
      where: { id: mentorId, accountId: user.accountId },
      select: { id: true, accountId: true },
    });

    if (!mentor) throw new ActionFailedException(ActionFailed.MENTOR_NOT_BELONG_TO_THIS_ACCOUNT, MentorErrorMessages.MSG02);

    const currentAchievement = await this.transactionHost.tx.profileAchievement.findFirst({
      where: { accountId: mentor.accountId, type: body.achievementType, isCurrent: true },
      select: { id: true },
    });

    if (body.isCurrent && currentAchievement) {
      await this.transactionHost.tx.profileAchievement.update({
        where: { id: currentAchievement.id },
        data: { isCurrent: false },
      });
    }

    const achievement = await this.transactionHost.tx.profileAchievement.create({
      data: MentorClientAchievementCreateREQ.ToCreateByAchievementType(body, mentor.accountId),
      select: { id: true },
    });

    return { mentorId: mentor.id, achievementId: achievement.id };
  }

  /* API: Delete achievements by mentor id */
  async deleteAchievement(mentorId: number, achievementId: number, user: AuthUserDTO) {
    const mentor = await this.transactionHost.tx.mentor.findFirst({
      where: { id: mentorId, accountId: user.accountId },
      select: { id: true, accountId: true },
    });

    if (!mentor) {
      throw new ActionFailedException(ActionFailed.ACCOUNT_NOT_FOUND, AccountErrorMessages.MSG01);
    }

    // Find all achievements of mentor by accountId
    const profileAchievements = await this.transactionHost.tx.profileAchievement.findMany({
      where: { accountId: mentor.accountId },
      select: { id: true },
    });

    const profileAchievementIds = profileAchievements.map((item) => item.id);

    if (!profileAchievementIds.includes(achievementId)) {
      throw new ActionFailedException(ActionFailed.MENTOR_PROFILE_ACHIEVEMENT_NOT_FOUND, MentorErrorMessages.MSG03);
    }

    await this.transactionHost.tx.profileAchievement.delete({ where: { id: achievementId } });

    return { mentorId: mentor.id, achievementId };
  }

  /* API: Mentor detail by mentor id */
  @Transactional(TRANSACTION_TIMEOUT)
  async detail(mentorId: number) {
    const mentor = (await this.transactionHost.tx.mentor.findFirstOrThrow(
      MentorClientDetailDTO.toFindFirst(mentorId),
    )) as MentorGetPayload;

    const achievements = await this.transactionHost.tx.profileAchievement.findMany(
      MentorClientDetailDTO.toFindManyAchievementsByAccountId(mentor.accountId),
    );

    const thumbnail = await this.imageService.getImageOriginal(mentor.Account.avatarId);
    const noOfSubscriptions = await this.transactionHost.tx.subscription.count({
      where: { Course: { creatorId: mentor.accountId } },
    });

    const data = {
      mentor,
      achievements,
      thumbnail,
      statisticData: { noOfSubscriptions, rateOfMentor: mentor.meanRates },
    };

    return data;
  }

  async getMentorByAccountId(accountId: number) {
    const mentor = (await this.transactionHost.tx.mentor.findFirstOrThrow(
      MentorClientDetailDTO.toFindByAccountId(accountId),
    )) as MentorGetPayload;

    const achievements = await this.transactionHost.tx.profileAchievement.findMany(
      MentorClientDetailDTO.toFindManyAchievementsByAccountId(mentor.accountId),
    );

    const noOfSubscriptions = await this.transactionHost.tx.subscription.count({
      where: { Course: { creatorId: mentor.accountId } },
    });

    const thumbnail = await this.imageService.getImageOriginal(mentor.Account.avatarId);
    const data = {
      mentor,
      achievements,
      statisticData: {
        noOfSubscriptions,
        rateOfMentor: mentor.meanRates,
      },
      thumbnail,
    };

    return data;
  }

  async getCoursesByMentorId(mentorId: number, user: AuthUserDTO, query: MentorClientCourseListREQ) {
    const mentor = await this.transactionHost.tx.mentor.findFirstOrThrow({
      where: { id: mentorId },
      select: { id: true, status: true, accountId: true },
    });

    this.logger.log('🚀 ~ MentorClientService ~ getCoursesByMentorId ~ mentor:', mentor);

    const isOwner = mentor.accountId === user.accountId;

    if (mentor.status !== MentorStatus.ACCEPTED) throw new ActionFailedException(ActionFailed.MENTOR_NOT_YET_ACCEPTED);

    return await this.courseClientService.getAllbyCreatorId(mentor.accountId, isOwner, query as any);
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async upsertCountView(user: AuthUserDTO, mentorId: number) {
    let mentor: any;
    try {
      mentor = await this.transactionHost.tx.mentor.findFirstOrThrow({
        where: { id: mentorId },
        select: { id: true, accountId: true },
      });
    } catch (error) {
      this.logger.error('🚀 ~ MentorClientService ~ upsertCountView ~ error:', error);
      throw new ActionFailedException(ActionFailed.MENTOR_NOT_FOUND, MentorErrorMessages.MSG04);
    }

    await this.transactionHost.tx.accountClick.upsert({
      where: {
        studentAccountId_mentorAccountId_clickType: {
          mentorAccountId: mentor.accountId,
          studentAccountId: user.accountId,
          clickType: ClickType.VIEW_DETAIL,
        },
      },
      create: {
        mentorAccountId: mentor.accountId,
        studentAccountId: user.accountId,
        clickType: ClickType.VIEW_DETAIL,
        noClicks: 1,
      },
      update: { noClicks: { increment: 1 } },
    });
  }
}
