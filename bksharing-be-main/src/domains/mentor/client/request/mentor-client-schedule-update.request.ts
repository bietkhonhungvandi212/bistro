import { DayOfWeek, Prisma } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { HourMinValidator } from 'src/shared/request-validator/hour-min-format.validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class MentorClientScheduleUpdateREQ {
  @HourMinValidator()
  startTime: string;

  @HourMinValidator()
  endTime: string;

  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IdValidator()
  @IsOptional()
  courseId?: number;

  static toUpdate(scheduleId: number, body: MentorClientScheduleUpdateREQ): Prisma.MentorScheduleUpdateArgs {
    const course = orUndefinedWithCondition(!!body.courseId, { Course: connectRelation(body.courseId) });

    return {
      where: { id: scheduleId },
      data: {
        dayOfWeek: body.dayOfWeek,
        startTime: body.startTime,
        endTime: body.endTime,
        ...course,
      },
      select: { id: true },
    };
  }
}
