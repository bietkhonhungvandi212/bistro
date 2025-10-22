import { Prisma } from '@prisma/client';
import { CourseClientDetailRESP } from 'src/domains/course/client/response/course-client-detail.response';

export type MentorGetPayload = Prisma.MentorGetPayload<{
  include: {
    Account: true;
  };
}>;

export type MentorScheduleGetPayload = Prisma.MentorScheduleGetPayload<{
  include: {
    Course: true;
    Mentor: true;
  };
}>;

export type ProfileAchievementGetPayload = Prisma.ProfileAchievementGetPayload<unknown>;

export type MentorScheduleCourseDetail = Pick<CourseClientDetailRESP, 'id' | 'name' | 'description'>;
