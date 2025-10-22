import { Injectable, Logger } from '@nestjs/common';
import {
  AccountType,
  CourseStatus,
  MentorStatus,
  NotificationRelationType,
  NotificationType,
  SubscriptionStatus,
} from '@prisma/client';
import { isEmpty } from 'lodash';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { FileService } from 'src/domains/file/file.service';
import { FileRESP } from 'src/domains/file/response/file.response';
import { ImageService } from 'src/domains/image/image.service';
import { MentorClientDetailDTO } from 'src/domains/mentor/admin/dto/mentor-client-detail.dto';
import { MentorGetPayload } from 'src/domains/mentor/shared/types';
import { NotificationHelper } from 'src/domains/notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from 'src/domains/notification/shared/types';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { COURSE_PUBLIC_STATUS, UNVAILABLE_COURSE_STATUS } from 'src/shared/constants/course.constant';
import { IS_ACTIVE_NESTED, TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { addCreationTimestamps } from 'src/shared/helpers/add-timestamp.helper';
import { runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { CourseGetPayload, CourseSectionGetPayload } from 'src/shared/types/payload-prisma';
import { CourseSectionDTO } from '../dto/course-section.dto';
import { CourseListFactory } from '../factory/course-list.factory';
import { CourseClientListREQ } from '../factory/list/course-client-list.request';
import { CourseListDTOType } from '../shared/enums';
import { CourseDetailQueryHelper } from '../shared/helper/course-detail-query.helper';
import { CourseListQueryHelper } from '../shared/helper/course-list-query.helper';
import { CourseSectionHelper } from '../shared/helper/course-section.helper';
import { CourseUpdateHelper } from '../shared/helper/course-update-query.helper';
import { CourseClientCreateREQ } from './request/course-client-create.request';
import { CourseClientUpdateREQ } from './request/course-client-update.request';
import { CourseSectionAddREQ, CourseSectionUpdateDTO } from './request/course-section-client-update.request';
import { CourseClientDetailRESP } from './response/course-client-detail.response';
import { CourseClientListRESP } from './response/course-client-list.response';

@Injectable()
export class CourseClientService {
  private readonly logger: Logger = new Logger(CourseClientService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
    private readonly fileService: FileService,
    private readonly eventEmitterService: EventEmitterService,
    private readonly courseListFactory: CourseListFactory,
  ) {}

  async list(query: CourseClientListREQ) {
    const courses = await this.transactionHost.tx.course.findMany(CourseListQueryHelper.toFindMany(query));
    const count = await this.transactionHost.tx.course.count({
      where: { ...CourseListQueryHelper.toQueryCondition(query), isPublic: true, status: CourseStatus.APPROVED },
    });

    const dtos = await Promise.all(
      courses.map(async (course: CourseGetPayload) => {
        const thumbnail = await this.imageService.getImageOriginal(course.imageId);
        const { mentor, thumbnail: mentorAvt } = await this.getMentorByAccountId(course.Creator.id);
        const noOfFeedbacks = await this.transactionHost.tx.feedback.count({
          where: { Subscription: { courseId: course.id, ...IS_ACTIVE_NESTED } },
        });

        return CourseClientListRESP.fromEntity(
          course,
          thumbnail,
          {
            id: mentor.id,
            accountId: mentor.accountId,
            name: mentor.Account.name,
            thumbnail: mentorAvt,
          },
          {
            noOfSubscriptions: course._count.Subscriptions,
            noOfFeedbacks,
            rateOfCourse: course.meanRates,
          },
        );
      }),
    );

    return { dtos, count };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async delete(id: number, user: AuthUserDTO) {
    //Check course belong to user
    let course: CourseGetPayload;
    try {
      course = (await this.transactionHost.tx.course.findUniqueOrThrow({
        where: { id: id, creatorId: user.accountId },
        select: {
          id: true,
          Sections: { select: { id: true, ...IS_ACTIVE_NESTED } },
          MentorSchedules: { select: { id: true, ...IS_ACTIVE_NESTED } },
        },
      })) as CourseGetPayload;
    } catch (error) {
      this.logger.error(error);
      throw new ActionFailedException(ActionFailed.COURSE_NOT_BELONG_TO_THIS_ACCOUNT);
    }

    //Check if any subscription is active so throw error
    const subscriptions = await this.transactionHost.tx.subscription.findMany({
      where: { courseId: id, status: SubscriptionStatus.ACTIVE, ...IS_ACTIVE_NESTED },
      select: { id: true },
    });

    if (!isEmpty(subscriptions)) throw new ActionFailedException(ActionFailed.COURSE_HAS_ACTIVE_SUBSCRIPTION);

    const sectionIds = await this.transactionHost.tx.courseSection.deleteMany({ where: { courseId: id } });
    if (!isEmpty(sectionIds)) {
      await Promise.all([
        //Delete course sections
        course.Sections.map(async (section) => {
          await this.transactionHost.tx.sectionAttachment.deleteMany({ where: { sectionId: section.id } });
        }),
        //Delete course schedules
        course.MentorSchedules.map(async (schedule) => {
          await this.transactionHost.tx.mentorSchedule.delete({ where: { id: schedule.id } });
        }),
      ]);
    }
    //Delete course
    await this.transactionHost.tx.course.delete({ where: { id } });

    //Delete schedule of course
    await this.transactionHost.tx.mentorSchedule.deleteMany({ where: { courseId: id } });
  }

  async listCoursesLearnedByAccountId(user: AuthUserDTO, query: CourseClientListREQ) {
    const factory = this.courseListFactory.getClass(CourseListDTOType.CLIENT, query);
    const courses = await this.transactionHost.tx.course.findMany(factory.toFindManyByAccount(user, query));

    const dtos = await Promise.all(
      courses.map(async (course: CourseGetPayload) => {
        const thumbnail = await this.imageService.getImageOriginal(course.imageId);
        const { mentor, thumbnail: mentorAvt } = await this.getMentorByAccountId(course.Creator.id);
        const noOfFeedbacks = await this.transactionHost.tx.feedback.count({
          where: { Subscription: { courseId: course.id, ...IS_ACTIVE_NESTED } },
        });

        return CourseClientListRESP.fromEntity(
          course,
          thumbnail,
          {
            id: mentor.id,
            accountId: mentor.accountId,
            name: mentor.Account.name,
            thumbnail: mentorAvt,
          },
          {
            noOfSubscriptions: course._count.Subscriptions,
            noOfFeedbacks,
            rateOfCourse: course.meanRates,
          },
        );
      }),
    );

    return dtos;
  }

  // async getAllCoursesByAccount(user: AuthUserDTO, query: CourseClientListREQ) {
  //   const factory = this.courseListFactory.getClass(CourseListDTOType.CLIENT, query);
  //   const courses = await this.transactionHost.tx.course.findMany(factory.toFindManyByAccount(user, query));
  //   const count = await this.transactionHost.tx.course.count({ where: CourseListQueryHelper.toQueryCondition(query) });

  //   const dtos = await Promise.all(
  //     courses.map(async (course: CourseGetPayload) => {
  //       const thumbnail = await this.imageService.getImageOriginal(course.imageId);
  //       return CourseClientListRESP.fromEntity(course, thumbnail);
  //     }),
  //   );

  //   return { dtos, count };
  // }

  async getPublicCourseDetail(id: number, accountId: number) {
    const { course, sectionDtos } = await this.detail(id);
    const isCoursePublic = COURSE_PUBLIC_STATUS.includes(course.status) && course.isPublic;

    if (!isCoursePublic && course.creatorId !== accountId) {
      throw new ActionFailedException(ActionFailed.COURSE_CANNOT_VIEW_DETAIL);
    }

    //TODO: Check if  course not public but student subcribed

    const image = await this.imageService.getImageOriginal(course.imageId);

    const { mentor, thumbnail } = await this.getMentorByAccountId(course.creatorId);

    return CourseClientDetailRESP.fromEntity(course, sectionDtos, image, {
      id: mentor.id,
      accountId: mentor.accountId,
      name: mentor.Account.name,
      thumbnail: thumbnail,
    });
  }

  async getMentorByAccountId(accountId: number) {
    const mentor = (await this.transactionHost.tx.mentor.findUniqueOrThrow(
      MentorClientDetailDTO.toFindByAccountId(accountId),
    )) as MentorGetPayload;

    const thumbnail = await this.imageService.getImageOriginal(mentor.Account.avatarId);

    return { mentor, thumbnail };
  }

  async detail(id: number) {
    const course = (await this.transactionHost.tx.course.findUniqueOrThrow(
      CourseDetailQueryHelper.toFindUnique(id),
    )) as CourseGetPayload;

    const sectionDtos = await Promise.all(
      course.Sections.map(async (section: CourseSectionGetPayload) => {
        const files = await this.transactionHost.tx.sectionAttachment.findMany({
          where: { sectionId: section.id },
          select: { fileId: true },
        });

        const fileIds = files.map((item) => item.fileId);
        await this.fileService.checkAttachmentUploadedOrThrow(fileIds);

        return CourseSectionDTO.fromEntity(section, await this.getAttachmentFiles(fileIds));
      }),
    );

    return { course, sectionDtos };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async update(id: number, user: AuthUserDTO, body: CourseClientUpdateREQ) {
    const course = await this.transactionHost.tx.course.findUniqueOrThrow({
      where: { id },
      select: { id: true, creatorId: true, totalDuration: true },
    });

    if (body.totalDuration !== course.totalDuration) {
      await this.transactionHost.tx.mentorSchedule.deleteMany({ where: { courseId: id } });
    }

    /* 1. Check course belong to user  */
    await this.checkCourseCreator(user.accountId, course.creatorId);

    /* 2. update course */
    const updatedCourse = await this.transactionHost.tx.course.update(CourseUpdateHelper.toUpdate(id, body));

    await this.imageService.linkImageToCourse(id, body.imageId);

    /* 3. TODO: Update notification to admin, and student subcribed */

    return updatedCourse;
  }

  async getAllbyCreatorId(creatorId: number, isOwner: boolean, query: CourseClientListREQ) {
    const courses = await this.transactionHost.tx.course.findMany(
      CourseListQueryHelper.toListByCreatorId(creatorId, isOwner, query),
    );

    const dtos = await Promise.all(
      courses.map(async (course: CourseGetPayload) => {
        const thumbnail = await this.imageService.getImageOriginal(course.imageId);
        const { mentor, thumbnail: mentorAvt } = await this.getMentorByAccountId(course.Creator.id);
        const noOfFeedbacks = await this.transactionHost.tx.feedback.count({
          where: { Subscription: { courseId: course.id, ...IS_ACTIVE_NESTED } },
        });

        return CourseClientListRESP.fromEntity(
          course,
          thumbnail,
          {
            id: mentor.id,
            accountId: mentor.accountId,
            name: mentor.Account.name,
            thumbnail: mentorAvt,
          },
          {
            noOfFeedbacks,
            noOfSubscriptions: course._count.Subscriptions,
            rateOfCourse: course.meanRates,
          },
        );
      }),
    );

    return dtos;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async create(user: AuthUserDTO, body: CourseClientCreateREQ) {
    const mentor = await this.transactionHost.tx.mentor.findFirstOrThrow({
      where: { accountId: user.accountId },
      select: { id: true, status: true },
    });

    if (mentor.status !== MentorStatus.ACCEPTED) throw new ActionFailedException(ActionFailed.MENTOR_NOT_YET_ACCEPTED);

    if (body.categoryId) await this.checkExistedCategory(body.categoryId);

    const course = await this.transactionHost.tx.course.create(CourseClientCreateREQ.toCreateInput(user, body));
    await this.imageService.linkImageToCourse(course.id, body.imageId);

    /* create course sections  */
    //TODO: Handle files in each
    for (const section of body.sections) {
      await this.createSection(course.id, section);
    }

    //Notification: send Notification to admin
    const admin = await this.transactionHost.tx.account.findFirst({
      where: { accountType: AccountType.ADMIN },
      select: { id: true },
    });

    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: course.id, type: NotificationRelationType.COURSE },
      admin.id,
      NotificationType.COURSE_CREATED,
    );

    runFunctionWithCondition(!!course, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });

    return course;
  }

  // ==================== METHOD ====================
  private async createSection(courseId: number, section: CourseSectionDTO) {
    if (!courseId) return;

    if (!isEmpty(section.files)) {
      const fileIds = section.files.map((item) => item.fileId);
      await this.checkFiles(fileIds);
    }

    const ordinal = await this.transactionHost.tx.courseSection.aggregate(CourseSectionHelper.toFindMaxOrdinal(courseId));
    const maxOrdinal = ordinal._max.ordinal || 0;

    const courseSection = await this.transactionHost.tx.courseSection.create({
      data: CourseSectionHelper.toCreateInput(courseId, section, maxOrdinal),
      select: { id: true },
    });

    return courseSection;
  }

  private async checkExistedCategory(categoryId: number) {
    const category = await this.transactionHost.tx.category.findFirst({
      where: { id: categoryId },
      select: { id: true, parentCategoryId: true },
    });

    if (!category) throw new ActionFailedException(ActionFailed.CATEGORY_NOT_FOUND);

    return category;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async updateStatus(id: number, body: CourseClientUpdateREQ) {
    const course = await this.transactionHost.tx.course.findUniqueOrThrow(CourseDetailQueryHelper.toFindUnique(id));

    if (UNVAILABLE_COURSE_STATUS.includes(body.status)) {
      const subscription = await this.transactionHost.tx.subscription.findFirst({
        where: { courseId: id, status: SubscriptionStatus.ACTIVE, ...IS_ACTIVE_NESTED },
        select: { id: true },
      });

      if (subscription) {
        this.logger.warn(`Course ${id} has active subscription`);
        throw new ActionFailedException(ActionFailed.COURSE_HAS_ACTIVE_SUBSCRIPTION);
      }

      this.logger.log(`Schedule of course ${id} will be deleted`);
      await this.transactionHost.tx.mentorSchedule.deleteMany({ where: { courseId: id } });
    }

    await this.transactionHost.tx.course.update({
      where: { id },
      data: { status: body.status },
    });

    return course.id;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async createSectionByCourseId(courseId: number, body: CourseSectionAddREQ, user: AuthUserDTO) {
    const course = await this.transactionHost.tx.course.findUniqueOrThrow({
      where: { id: courseId },
      select: { id: true, creatorId: true },
    });

    /* 1. Check course belong to user  */
    await this.checkCourseCreator(user.accountId, course.creatorId);

    /* 2. update section */
    const section = await this.createSection(courseId, body);

    return { courseId: course.id, sectionId: section.id };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async updateSectionByCourseId(courseId: number, sectionId: number, body: CourseSectionUpdateDTO, user: AuthUserDTO) {
    const course = await this.transactionHost.tx.course.findUniqueOrThrow({
      where: { id: courseId },
      select: { id: true, creatorId: true, Sections: { where: { id: sectionId } } },
    });

    /* 1. Check course belong to user  */
    await this.checkCourseCreator(user.accountId, course.creatorId);

    /* 2. update section */
    const section = await this.transactionHost.tx.courseSection.update({
      where: { id: sectionId, courseId },
      data: CourseSectionHelper.toUpdateInput(body),
      select: { id: true },
    });

    const fileIds = body.files.map((item) => item.fileId);
    await this.updateSectionAttachments(sectionId, fileIds);

    return { courseId: course.id, sectionId: section.id };
  }

  async updateSectionAttachments(sectionId: number, fileIds: number[]) {
    if (isEmpty(fileIds)) return;

    const attachments = await this.transactionHost.tx.sectionAttachment.findMany({
      where: { sectionId },
      select: { fileId: true },
    });

    const existedFileIds = attachments.map((item) => item.fileId);
    const notSectionFileIds = fileIds.filter((id) => !existedFileIds.includes(id));
    if (!isEmpty(notSectionFileIds)) {
      await this.checkFiles(notSectionFileIds);
      await this.transactionHost.tx.sectionAttachment.createMany({
        data: notSectionFileIds.map((fileId) => addCreationTimestamps({ sectionId, fileId })),
      });
    }

    for (const file of existedFileIds) {
      if (!fileIds.includes(file)) {
        const numberOfRecords = await this.transactionHost.tx.$executeRaw`DELETE FROM section_attachments WHERE file_id=${file}`;
        runFunctionWithCondition(numberOfRecords > 0, async () => await this.fileService.delete(file));
      }
    }
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async deleteSectionByCourseId(courseId: number, sectionId: number, user: AuthUserDTO) {
    const course = await this.transactionHost.tx.course.findUniqueOrThrow({
      where: { id: courseId },
      select: { id: true, creatorId: true, Sections: { where: { id: sectionId } } },
    });

    /* 1. Check course belong to user  */
    await this.checkCourseCreator(user.accountId, course.creatorId);
    const sectionIds = course.Sections.map((section) => section.id);

    if (isEmpty(sectionIds) || !sectionIds.includes(sectionId))
      throw new ActionFailedException(ActionFailed.COURSE_SECTION_NOT_FOUND_IN_COURSE);

    const section = await this.transactionHost.tx.courseSection.findFirst({
      where: { id: sectionId, courseId },
      select: { id: true, SectionAttachments: { select: { fileId: true } } },
    });

    /* 2. delete section attachments */
    const fileIds = section.SectionAttachments.map((item) => item.fileId);

    if (!isEmpty(fileIds)) {
      const numberOfRecords = await this.transactionHost.tx
        .$executeRaw`DELETE FROM section_attachments WHERE section_id=${sectionId}`;

      runFunctionWithCondition(numberOfRecords > 0, async () => await this.fileService.checkAttachmentUploadedOrThrow(fileIds));
    }

    /* 3. delete course sections */
    await this.transactionHost.tx.courseSection.delete({
      where: { id: sectionId, courseId: courseId },
    });

    return { courseId: course.id, sectionId: section.id };
  }

  // async updateTotalDuration(courseId: number) {
  //   const totalDuration = await this.transactionHost.tx.courseSection.aggregate({
  //     where: { courseId, ...IS_ACTIVE_NESTED },
  //     _sum: { duration: true },
  //   });

  //   await this.transactionHost.tx.course.update({
  //     where: { id: courseId },
  //     data: { totalDuration: totalDuration._sum.duration },
  //   });
  // }

  @Transactional(TRANSACTION_TIMEOUT)
  async checkFiles(fileIds: number[]) {
    await this.fileService.checkAttachmentUploadedOrThrow(fileIds);
    // await this.fileService.checkFileLinked(fileIds);

    /* Create and link file */
    await this.fileService.enableUploaded(fileIds);
  }

  async checkCourseCreator(accountId: number, creatorId: number) {
    if (accountId !== creatorId) throw new ActionFailedException(ActionFailed.COURSE_NOT_BELONG_TO_THIS_ACCOUNT);
  }

  async getAttachmentFiles(fileIds: number[]): Promise<FileRESP[]> {
    return Promise.all(fileIds.map(async (fileId) => await this.fileService.detail(fileId)));
  }
}
