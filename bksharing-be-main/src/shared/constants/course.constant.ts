import { CourseStatus } from '@prisma/client';

export const COURSE_PUBLIC_STATUS: CourseStatus[] = [CourseStatus.STOPPED, CourseStatus.APPROVED];

export const COURSE_UPDATE_STATUS: CourseStatus[] = [
  CourseStatus.PENDING,
  CourseStatus.STOPPED,
  CourseStatus.ARCHIVED,
  CourseStatus.DRAFT,
];

export const UNVAILABLE_COURSE_STATUS: CourseStatus[] = [
  CourseStatus.ARCHIVED,
  CourseStatus.STOPPED,
  CourseStatus.SUSPENDED,
  CourseStatus.DRAFT,
];
