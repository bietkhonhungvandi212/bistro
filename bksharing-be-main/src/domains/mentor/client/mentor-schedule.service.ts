import { Injectable, Logger } from '@nestjs/common';
import { CourseStatus, MentorSchedule, NotificationRelationType, NotificationType } from '@prisma/client';
import { isEmpty } from 'lodash';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { checkHourMinStartOverlap } from 'src/shared/helpers/common.helper';
import { MentorScheduleGetPayload } from '../shared/types';
import { MentorClientScheduleCreateREQ } from './request/mentor-client-schedule-create.request';
import { MentorScheduleClientListREQ } from './request/mentor-client-schedule-list.request';
import { MentorClientScheduleUpdateREQ } from './request/mentor-client-schedule-update.request';

import { Cron } from '@nestjs/schedule';
import { NotificationHelper } from 'src/domains/notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from 'src/domains/notification/shared/types';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { SUBSCRIPTION_ACTIVE_STATUS } from 'src/shared/constants/subscription.constant';
import { MentorSchedulDurationListRESP, MentorScheduleListRESP } from './response /mentor-schedule-list.response';

@Injectable()
export class MentorScheduleService {
  private readonly logger = new Logger(MentorScheduleService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  @Cron('0 0 20 */3 * *', {
    name: 'handleCourseNotScheduled',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCourseNotScheduled() {
    const courses = await this.transactionHost.tx.course.findMany({
      where: { status: CourseStatus.APPROVED },
      select: { id: true, creatorId: true, MentorSchedules: { select: { id: true } } },
    });

    for (const course of courses) {
      if (isEmpty(course.MentorSchedules)) {
        this.logger.warn(`Course ${course.id} has no mentor schedule`);

        const payload = NotificationHelper.makeAppNotificationPayload(
          { id: course.id, type: NotificationRelationType.COURSE },
          course.creatorId,
          NotificationType.COURSE_NOT_YET_SCHEDULED,
        );

        this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
      }
    }
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async createScheduleByAccountId(user: AuthUserDTO, body: MentorClientScheduleCreateREQ): Promise<any> {
    const existedMentor = await this.findMentorByAccountId(user.accountId);

    if (body.courseId) {
      await this.transactionHost.tx.course
        .findUnique({
          where: { id: body.courseId, creatorId: user.accountId, status: CourseStatus.APPROVED },
          select: { id: true, status: true },
        })
        .then((course) => {
          if (!course) throw new ActionFailedException(ActionFailed.COURSE_NOT_FOUND);
          else if (course.status !== CourseStatus.APPROVED) throw new ActionFailedException(ActionFailed.COURSE_NOT_AVAILABLE);
        });
    }

    if (!this.checkOneHourFromStartTime(body.startTime, body.endTime))
      throw new ActionFailedException(ActionFailed.MENTOR_SCHEDULE_TIME_NOT_UNDER_ONE_HOUR);

    await this.checkOverlapSchedule(existedMentor.id, body);

    const schedule = await this.transactionHost.tx.mentorSchedule.create(
      MentorClientScheduleCreateREQ.toCreate(existedMentor.id, body),
    );

    return schedule;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async updateMentorSchedule(
    user: AuthUserDTO,
    scheduleId: number,
    body: MentorClientScheduleUpdateREQ,
  ): Promise<MentorSchedule> {
    const existedSchedule = await this.transactionHost.tx.mentorSchedule.findFirstOrThrow({
      where: { id: scheduleId, Mentor: { accountId: user.accountId } },
      select: { mentorId: true },
    });

    if (body.courseId) {
      await this.transactionHost.tx.course
        .findUnique({
          where: { id: body.courseId, creatorId: user.accountId, status: CourseStatus.APPROVED },
          select: { id: true },
        })
        .then((course) => {
          if (!course) throw new ActionFailedException(ActionFailed.COURSE_NOT_BELONG_TO_THIS_ACCOUNT);
        });
    }

    const subscriptions = await this.transactionHost.tx.subscription.findMany({
      where: { Course: { creatorId: user.accountId }, status: { in: SUBSCRIPTION_ACTIVE_STATUS }, mentorScheduleId: scheduleId },
      select: { id: true },
    });

    if (subscriptions.length > 0) throw new ActionFailedException(ActionFailed.MENTOR_SCHEDULE_IS_BOOKED);

    if (!this.checkOneHourFromStartTime(body.startTime, body.endTime))
      throw new ActionFailedException(ActionFailed.MENTOR_SCHEDULE_TIME_NOT_UNDER_ONE_HOUR);

    const existedSchedulesExcludeCurrId = await this.transactionHost.tx.mentorSchedule.findMany({
      where: { mentorId: existedSchedule.mentorId, dayOfWeek: body.dayOfWeek, id: { not: scheduleId } },
      select: { id: true, startTime: true, endTime: true },
    });

    if (!isEmpty(existedSchedulesExcludeCurrId)) {
      const isOverlap = existedSchedulesExcludeCurrId.some((schedule) =>
        checkHourMinStartOverlap(schedule.startTime, schedule.endTime, body.startTime, body.endTime),
      );

      if (isOverlap) throw new ActionFailedException(ActionFailed.MENTOR_SCHEDULE_OVERLAP);
    }

    // Step 3: Update schedule
    const schedule = await this.transactionHost.tx.mentorSchedule.update(
      MentorClientScheduleUpdateREQ.toUpdate(scheduleId, body),
    );

    return schedule;
  }

  async getSchedulesByAccountId(accountId: number): Promise<MentorScheduleListRESP[]> {
    const mentor = await this.findMentorByAccountId(accountId);

    const schedules = (await this.transactionHost.tx.mentorSchedule.findMany(
      MentorScheduleClientListREQ.toFindMany(mentor.id),
    )) as MentorScheduleGetPayload[];

    return MentorScheduleListRESP.fromEntity(schedules);
  }

  async getScheduleDurationsByAccountId(accountId: number) {
    const courses = await this.transactionHost.tx.course.findMany({
      where: { creatorId: accountId },
      select: { id: true, name: true, totalDuration: true },
    });

    return courses.map(MentorSchedulDurationListRESP.fromCourseEntity);
  }

  async getSchedulesOfCourseByMentorId(mentorId: number, courseId: number): Promise<MentorScheduleListRESP[]> {
    let mentor: any;
    try {
      mentor = await this.transactionHost.tx.mentor.findUniqueOrThrow({
        where: { id: mentorId },
        select: { id: true, accountId: true },
      });
    } catch (error) {
      this.logger.error(error);

      throw new ActionFailedException(ActionFailed.MENTOR_NOT_FOUND);
    }

    try {
      await this.transactionHost.tx.course.findUniqueOrThrow({
        where: { id: courseId, creatorId: mentor.accountId },
        select: { id: true },
      });
    } catch (error) {
      this.logger.error(error);

      throw new ActionFailedException(ActionFailed.COURSE_NOT_BELONG_TO_THIS_ACCOUNT);
    }

    const schedules = (await this.transactionHost.tx.mentorSchedule.findMany(
      MentorScheduleClientListREQ.toFindManySchedulesOfCourse(mentor.id, courseId),
    )) as MentorScheduleGetPayload[];

    return MentorScheduleListRESP.fromEntity(schedules);
  }

  async deleteScheduleById(accountId: number, scheduleId: number): Promise<void> {
    const mentor = await this.findMentorByAccountId(accountId);

    const numberOfDeleted = await this.transactionHost.tx
      .$executeRaw`DELETE FROM "mentor_schedules" WHERE id = ${scheduleId} AND "mentor_id" = ${mentor.id}`;

    if (numberOfDeleted <= 0) throw new ActionFailedException(ActionFailed.MENTOR_SCHEDULE_NOT_FOUND);
  }

  private checkOneHourFromStartTime(startTime: string, endTime: string): boolean {
    const hour1 = Number(startTime.split(':')[0] ?? 0) + Number(startTime.split(':')[1] ?? 0) / 60;
    const hour2 = Number(endTime.split(':')[0] ?? 0) + Number(endTime.split(':')[1] ?? 0) / 60;

    return hour2 - hour1 >= 1;
  }

  private async findMentorByAccountId(accountId: number) {
    return this.transactionHost.tx.mentor.findUniqueOrThrow({
      where: { accountId },
      select: { id: true },
    });
  }

  private async checkOverlapSchedule(mentorId: number, body: MentorClientScheduleCreateREQ) {
    const existedSchedules = await this.transactionHost.tx.mentorSchedule.findMany({
      where: { mentorId: mentorId, dayOfWeek: body.dayOfWeek },
      select: { id: true, startTime: true, endTime: true },
    });

    if (!isEmpty(existedSchedules)) {
      const isOverlap = existedSchedules.some((schedule) =>
        checkHourMinStartOverlap(schedule.startTime, schedule.endTime, body.startTime, body.endTime),
      );

      if (isOverlap) throw new ActionFailedException(ActionFailed.MENTOR_SCHEDULE_OVERLAP);
    }
  }
}
