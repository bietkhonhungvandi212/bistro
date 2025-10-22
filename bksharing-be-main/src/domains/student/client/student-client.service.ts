import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/domains/auth/auth.service';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { ImageService } from 'src/domains/image/image.service';
import { ProfileAchievementGetPayload } from 'src/domains/mentor/shared/types';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { StudentAchievementCreateREQ } from '../request/student-achievement-create.request';
import { StudentAchievementUpdateREQ } from '../request/student-achievement-update.request';
import { StudentProfileDetailREQ } from '../request/student-profile-detail.request';
import { StudentGetPayload } from '../shared/types';

@Injectable()
export class StudentClientService {
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
    private readonly authService: AuthService,
  ) {}

  async getStudentByAccountId(accountId: number) {
    const student = (await this.transactionHost.tx.student.findFirstOrThrow(
      StudentProfileDetailREQ.toFindByAccountId(accountId),
    )) as StudentGetPayload;

    const achievements = await this.getStudentAchievements(student.accountId);
    const thumbnail = await this.imageService.getImageOriginal(student.Account.avatarId);

    const data = {
      student,
      achievements,
      thumbnail,
    };

    return data;
  }

  async getStudentAchievements(accountId: number): Promise<ProfileAchievementGetPayload[]> {
    const achievements = (await this.transactionHost.tx.profileAchievement.findMany({
      where: { accountId: accountId },
      select: {
        id: true,
        name: true,
        major: true,
        position: true,
        organization: true,
        startDate: true,
        endDate: true,
        type: true,
        description: true,
        createdAt: true,
      },
    })) as ProfileAchievementGetPayload[];

    return achievements;
  }

  /* API: Update achievements by student id */
  @Transactional(TRANSACTION_TIMEOUT)
  async updateAchievements(studentId: number, body: StudentAchievementUpdateREQ, user: AuthUserDTO) {
    const student = await this.transactionHost.tx.student.findFirst({
      where: { id: studentId, accountId: user.accountId },
      select: { id: true, accountId: true },
    });

    if (!student) {
      throw new ActionFailedException(ActionFailed.STUDENT_NOT_FOUND);
    }

    // Find all achievements of student by accountId
    const profileAchievements = await this.transactionHost.tx.profileAchievement.findMany({
      where: { accountId: student.accountId },
      select: { id: true },
    });

    const profileAchievementIds = profileAchievements.map((item) => item.id);

    if (!profileAchievementIds.includes(body.id)) {
      throw new ActionFailedException(ActionFailed.STUDENT_PROFILE_ACHIEVEMENT_NOT_FOUND);
    }

    const currentAchievement = await this.transactionHost.tx.profileAchievement.findFirst({
      where: { accountId: student.accountId, isCurrent: true },
      select: { id: true },
    });

    if (body.isCurrent && currentAchievement && currentAchievement.id !== body.id) {
      await this.transactionHost.tx.profileAchievement.update({
        where: { id: currentAchievement.id },
        data: { isCurrent: false },
      });
    }

    const achievement = await this.transactionHost.tx.profileAchievement.update({
      where: { id: body.id },
      data: StudentAchievementUpdateREQ.ToUpdateByAchievementType(body),
      select: { id: true },
    });

    return { student: student.id, achievementId: achievement.id };
  }

  /* API: Add achievements by student id */
  @Transactional(TRANSACTION_TIMEOUT)
  async addProfileAchievement(studentId: number, body: StudentAchievementCreateREQ, user: AuthUserDTO) {
    const student = await this.transactionHost.tx.student.findUnique({
      where: { id: studentId, accountId: user.accountId },
      select: { id: true, accountId: true },
    });

    if (!student) throw new ActionFailedException(ActionFailed.STUDENT_NOT_FOUND);

    const currentAchievement = await this.transactionHost.tx.profileAchievement.findFirst({
      where: { accountId: student.accountId, isCurrent: true },
      select: { id: true },
    });

    if (body.isCurrent && currentAchievement) {
      await this.transactionHost.tx.profileAchievement.update({
        where: { id: currentAchievement.id },
        data: { isCurrent: false },
      });
    }

    const achievement = await this.transactionHost.tx.profileAchievement.create({
      data: StudentAchievementCreateREQ.ToCreateByAchievementType(body, student.accountId),
      select: { id: true },
    });

    return { studentId: student.id, achievementId: achievement.id };
  }

  /* API: Delete achievements by student id */
  async deleteAchievement(studentId: number, achievementId: number, user: AuthUserDTO) {
    const student = await this.transactionHost.tx.student.findFirst({
      where: { id: studentId, accountId: user.accountId },
      select: { id: true, accountId: true },
    });

    if (!student) {
      throw new ActionFailedException(ActionFailed.ACCOUNT_NOT_FOUND);
    }

    // Find all achievements of student by accountId
    const profileAchievements = await this.transactionHost.tx.profileAchievement.findMany({
      where: { accountId: student.accountId },
      select: { id: true },
    });

    const profileAchievementIds = profileAchievements.map((item) => item.id);

    if (!profileAchievementIds.includes(achievementId)) {
      throw new ActionFailedException(ActionFailed.STUDENT_PROFILE_ACHIEVEMENT_NOT_FOUND);
    }

    await this.transactionHost.tx.profileAchievement.delete({ where: { id: achievementId } });

    return { student: student.id, achievementId };
  }
}
