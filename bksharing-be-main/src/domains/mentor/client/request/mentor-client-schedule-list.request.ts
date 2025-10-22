import { Prisma } from '@prisma/client';

export class MentorScheduleClientListREQ {
  static toFindMany(mentorId: number): Prisma.MentorScheduleFindManyArgs {
    return {
      where: { mentorId: mentorId },
      select: {
        id: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        Course: { select: { id: true, name: true, description: true } },
      },
    };
  }

  static toFindManySchedulesOfCourse(mentorId: number, courseId: number): Prisma.MentorScheduleFindManyArgs {
    return {
      where: { mentorId: mentorId, courseId: courseId },
      select: {
        id: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        Course: { select: { id: true, name: true, description: true } },
      },
    };
  }
}
