import { DayOfWeek, Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { HourMinValidator } from 'src/shared/request-validator/hour-min-format.validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class MentorClientScheduleCreateREQ {
  @HourMinValidator()
  startTime: string;

  @HourMinValidator()
  endTime: string;

  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IdValidator()
  courseId: number;

  static toCreate(id: number, body: MentorClientScheduleCreateREQ): Prisma.MentorScheduleCreateArgs {
    const course = orUndefinedWithCondition(!!body.courseId, { Course: connectRelation(body.courseId) });

    return {
      data: {
        dayOfWeek: body.dayOfWeek,
        startTime: body.startTime,
        endTime: body.endTime,
        Mentor: connectRelation(id),
        ...course,
      },
      select: { id: true },
    };
  }
}
