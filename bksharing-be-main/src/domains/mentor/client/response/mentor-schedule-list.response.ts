import { Course } from '@prisma/client';
import { MentorScheduleCourseDetail, MentorScheduleGetPayload } from '../../shared/types';

export class MentorSchedulDurationListRESP {
  courseId: number;
  name: string;
  duration: number;

  static fromCourseEntity(course: Course): MentorSchedulDurationListRESP {
    return {
      courseId: course.id,
      name: course.name,
      duration: course.totalDuration,
    };
  }
}

export class MentorScheduleListRESP {
  dayOfWeek: string;
  timeRanges: { id: number; startTime: string; endTime: string; course: MentorScheduleCourseDetail }[] = [];

  static fromEntity(entities: MentorScheduleGetPayload[]): MentorScheduleListRESP[] {
    const response: MentorScheduleListRESP[] = [];

    entities.forEach((entity) => {
      const existed = response.find((item) => item.dayOfWeek === entity.dayOfWeek);
      const data = {
        id: entity.id,
        startTime: entity.startTime,
        endTime: entity.endTime,
        course: this.fromEntityWithCourse(entity.Course as Course),
      };

      if (existed) {
        existed.timeRanges.push(data);
      } else {
        response.push({ dayOfWeek: entity.dayOfWeek, timeRanges: [data] });
      }
    });

    return response;
  }

  static fromEntityWithCourse(course: Course): MentorScheduleCourseDetail {
    if (!course) return null;

    return {
      id: course.id,
      name: course.name,
      description: course.description,
    };
  }
}
