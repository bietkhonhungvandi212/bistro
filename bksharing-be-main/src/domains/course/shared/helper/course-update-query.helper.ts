import { Prisma } from '@prisma/client';
import { connectRelation, removeRelation } from 'src/shared/helpers/prisma.helper';
import { parsePrismaDate } from 'src/shared/parsers/datetime.parse';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { CourseClientUpdateREQ } from '../../client/request/course-client-update.request';

export class CourseUpdateHelper {
  static toUpdate(id: number, body: CourseClientUpdateREQ): Prisma.CourseUpdateArgs {
    return {
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        isPublic: body.isPublic,
        startDate: parsePrismaDate(body.startDate),
        status: body.status,
        endDate: parsePrismaDate(body.endDate),
        objectives: body.objectives,
        targetAudiences: body.targetAudiences,
        prerequisites: body.prerequisites,
        litmitOfStudents: body.litmitOfStudents,
        Category: connectRelation(body.categoryId),
        ...orUndefinedWithCondition(!!body.imageId, { Image: removeRelation() }),
      },
      select: { id: true },
    };
  }
}
