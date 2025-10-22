import { Injectable } from '@nestjs/common';
import { MentorStatus, NotificationRelationType, NotificationType, RoomStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AudioCallAdminService } from 'src/domains/audio-call/admin/audio-call-admin.service';
import { AudioRoomGetPayload } from 'src/domains/audio-call/shared/types';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { FileService } from 'src/domains/file/file.service';
import { ImageService } from 'src/domains/image/image.service';
import { NotificationHelper } from 'src/domains/notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from 'src/domains/notification/shared/types';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { MentorErrorMessages } from 'src/shared/messages/error-messages';
import { MentorGetPayload } from '../shared/types';
import { MentorAdminDetailDTO } from './dto/mentor-admin-detail.dto';
import { MentorAdminApproveREQ } from './request/mentor-admin-approve.request';
import { MentorAdminInterviewREQ } from './request/mentor-admin-interview.request';
import { MentorAdminListREQ } from './request/mentor-admin-list.request';
import { MentorAdminListRESP } from './response/mentor-admin-list.response';

@Injectable()
export class MentorAdminService {
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly audioCallAdminService: AudioCallAdminService,
    private readonly imageService: ImageService,
    private readonly fileService: FileService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  /* API: List mentor */
  async list(query: MentorAdminListREQ) {
    const mentors = await this.transactionHost.tx.mentor.findMany(MentorAdminListREQ.toFindMany(query));
    const count = await this.transactionHost.tx.mentor.count({ where: MentorAdminListREQ.toQueryCondition(query) });

    const mentorsDTO = await Promise.all(
      mentors.map(async (mentor: MentorGetPayload) => {
        const thumbnail = await this.imageService.getImageOriginal(mentor.Account.avatarId);
        const cv = await this.fileService.detail(mentor.fileId);

        const achievements = await this.transactionHost.tx.profileAchievement.findMany({
          where: { accountId: mentor.accountId },
          select: { type: true, isCurrent: true },
        });

        const noOfSubscriptions = await this.transactionHost.tx.subscription.count({
          where: { Course: { creatorId: mentor.accountId } },
        });

        const rateOfMentor = await this.transactionHost.tx.feedback.aggregate({
          where: { Subscription: { Course: { creatorId: mentor.accountId } } },
          _avg: { mentorRating: true },
        });

        return MentorAdminListRESP.fromEntity(
          mentor,
          { noOfSubscriptions, rateOfMentor: rateOfMentor._avg.mentorRating },
          achievements.map((achievement) => ({ type: achievement.type, isCurrent: achievement.isCurrent })),
          thumbnail,
          cv,
        );
      }),
    );

    return { mentorsDTO, count };
  }

  async detail(mentorId: number) {
    const mentor = (await this.transactionHost.tx.mentor.findUniqueOrThrow(
      MentorAdminDetailDTO.toFindUnique(mentorId),
    )) as MentorGetPayload;

    const achievements = await this.transactionHost.tx.profileAchievement.findMany(
      MentorAdminDetailDTO.toFindManyAchievements(mentor.accountId),
    );

    const thumbnail = await this.imageService.getImageOriginal(mentor.Account.avatarId);
    const cv = await this.fileService.detail(mentor.fileId);
    const data = { mentor, achievements, thumbnail, cv };

    return data;
  }

  /* API: Create interview with mentor */
  async interviewMentor(user: AuthUserDTO, mentorId: number, body: MentorAdminInterviewREQ) {
    const mentor = await this.transactionHost.tx.mentor.findFirstOrThrow({
      where: { id: mentorId },
      select: { id: true, accountId: true, status: true },
    });

    if (mentor.status == MentorStatus.ACCEPTED) {
      throw new ActionFailedException(ActionFailed.MENTOR_INTERVIEW_ACCEPTED);
    }

    const call = (await this.audioCallAdminService.createAudioCall(
      user,
      MentorAdminInterviewREQ.toAudioRoomCreateREQ(mentor.accountId, body),
    )) as AudioRoomGetPayload;

    //generate cid
    const cid = `${new Date().getTime()}-${call.id}-${randomUUID()}`;
    await this.transactionHost.tx.audioRoom.update({
      where: { id: call.id },
      data: { cid: cid },
      select: { id: true },
    });

    //Notification: send notification to mentor
    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: call.id, type: NotificationRelationType.AUDIO_CALL },
      mentor.accountId,
      NotificationType.AUDIO_CALL_CREATED,
    );
    runFunctionWithCondition(!!mentor, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });

    return { cid: cid, ...call };
  }

  /* API: Approve or Reject Mentor after interview */
  @Transactional(TRANSACTION_TIMEOUT)
  async updateResultInterview(user: AuthUserDTO, id: number, body: MentorAdminApproveREQ) {
    //1. update mentor status
    const mentor = await this.transactionHost.tx.mentor.update(MentorAdminApproveREQ.toApprove(id, body, user));

    const onGoingInterview = await this.transactionHost.tx.audioRoom.findFirst({
      where: { status: RoomStatus.ONGOING, creatorId: user.accountId, Participants: { some: { accountId: mentor.accountId } } },
      select: { id: true },
    });

    if (onGoingInterview) {
      throw new ActionFailedException(ActionFailed.MENTOR_CANNOT_UPDATE_RESULT, MentorErrorMessages.MSG01);
    }

    //2. Deletes all scheduled interviews
    await this.transactionHost.tx.audioRoom.deleteMany({
      where: { status: RoomStatus.SCHEDULED, Participants: { some: { accountId: mentor.accountId } } },
    });

    await this.transactionHost.tx.audioRoomParticipant.updateMany({
      where: { accountId: mentor.accountId, AudioRoom: { creatorId: user.accountId } },
      data: { isInCall: false, isActive: false },
    });

    //Notification: send notification to mentor
    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: mentor.id, type: NotificationRelationType.MENTOR },
      mentor.accountId,
      body.isApproved ? NotificationType.MENTOR_APPROVED : NotificationType.MENTOR_REJECTED,
    );
    runFunctionWithCondition(!!mentor, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });

    return mentor;
  }
}
