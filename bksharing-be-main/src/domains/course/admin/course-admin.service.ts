import { Injectable } from '@nestjs/common';
import { CourseStatus, NotificationRelationType, NotificationType } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { FileService } from 'src/domains/file/file.service';
import { FileRESP } from 'src/domains/file/response/file.response';
import { ImageService } from 'src/domains/image/image.service';
import { NotificationHelper } from 'src/domains/notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from 'src/domains/notification/shared/types';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { IS_ACTIVE_NESTED, TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { CourseErrorMessages } from 'src/shared/messages/error-messages';
import { CourseGetPayload, CourseSectionGetPayload } from 'src/shared/types/payload-prisma';
import { CourseSectionDTO } from '../dto/course-section.dto';
import { CourseListFactory } from '../factory/course-list.factory';
import { CourseAdminListREQ } from '../factory/list/course-admin-list.request';
import { CourseListDTOType } from '../shared/enums';
import { CourseDetailQueryHelper } from '../shared/helper/course-detail-query.helper';
import { CourseListQueryHelper } from '../shared/helper/course-list-query.helper';
import { CourseApproveREQ } from './request/course-approve.request';
import { CourseAdminListRESP } from './response/course-admin-list.response';

@Injectable()
export class CourseAdminService {
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
    private readonly fileService: FileService,
    private readonly courseListFactory: CourseListFactory,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async list(user: AuthUserDTO, query: CourseAdminListREQ) {
    const factory = this.courseListFactory.getClass(CourseListDTOType.ADMIN, query);
    const courses = await this.transactionHost.tx.course.findMany(factory.toFindManyByAccount(user, query));
    const count = await this.transactionHost.tx.course.count({ where: CourseListQueryHelper.toQueryCondition(query) });

    const dtos = await Promise.all(
      courses.map(async (course: CourseGetPayload) => {
        const thumbnail = await this.imageService.getImageOriginal(course.imageId);
        const noOfFeedbacks = await this.transactionHost.tx.feedback.count({
          where: { Subscription: { courseId: course.id, ...IS_ACTIVE_NESTED } },
        });

        const ratingOfCourse = await this.transactionHost.tx.feedback.aggregate({
          where: { Subscription: { courseId: course.id, ...IS_ACTIVE_NESTED } },
          _avg: { courseRating: true },
        });

        return CourseAdminListRESP.fromEntity(course, thumbnail, {
          noOfFeedbacks,
          noOfSubscriptions: course._count.Subscriptions,
          rateOfCourse: ratingOfCourse._avg.courseRating,
        });
      }),
    );

    return { dtos, count };
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

    const image = await this.imageService.getImageOriginal(course.imageId);

    return { course, sectionDtos, image };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async approve(id: number, body: CourseApproveREQ) {
    console.log('🚀 ~ CourseAdminService ~ approve ~ body:', body);
    const course = (await this.transactionHost.tx.course.findUniqueOrThrow(
      CourseDetailQueryHelper.toFindUnique(id),
    )) as CourseGetPayload;

    if (![CourseStatus.DRAFT, CourseStatus.PENDING].includes(course.status as any)) {
      throw new ActionFailedException(ActionFailed.COURSE_STATUS_CANNOT_UPDATE, CourseErrorMessages.MSG02);
    }

    const updatedCourse = await this.transactionHost.tx.course.update({
      where: { id: course.id },
      data: { status: body.isApproved ? CourseStatus.APPROVED : CourseStatus.REJECTED },
      select: { id: true, creatorId: true },
    });

    //Notification: Send notification to course owner
    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: course.id, type: NotificationRelationType.COURSE },
      updatedCourse.creatorId,
      body.isApproved ? NotificationType.COURSE_APPROVED : NotificationType.COURSE_REJECTED,
    );

    runFunctionWithCondition(!!updatedCourse, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });

    return updatedCourse;
  }

  async getAttachmentFiles(fileIds: number[]): Promise<FileRESP[]> {
    return Promise.all(fileIds.map(async (fileId) => await this.fileService.detail(fileId)));
  }
}
