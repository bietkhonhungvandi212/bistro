import { Prisma } from '@prisma/client';
import { isEmpty } from 'lodash';
import { addCreationTimestamps } from 'src/shared/helpers/add-timestamp.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { CourseSectionUpdateDTO } from '../../client/request/course-section-client-update.request';
import { CourseSectionDTO } from '../../dto/course-section.dto';

export class CourseSectionHelper {
  static toCreateInput(courseId: number, body: CourseSectionDTO, maxOrdinal: number): Prisma.CourseSectionCreateInput {
    //TODO: Add fileData
    const fileData = orUndefinedWithCondition(!isEmpty(body.files), {
      SectionAttachments: {
        createMany: {
          data: body.files.map((item) => addCreationTimestamps({ fileId: item.fileId, isPublic: item.isPublic })),
        },
      },
    });

    return {
      title: body.title,
      ordinal: maxOrdinal + 1,
      description: body.description,
      isPublic: body.isPublic,
      Course: connectRelation(courseId),
      ...fileData,
    };
  }

  static toUpdateInput(body: CourseSectionUpdateDTO): Prisma.CourseSectionUpdateInput {
    return {
      title: body.title,
      description: body.description,
      isPublic: body.isPublic,
    };
  }

  static toFindMaxOrdinal(courseId: number): Prisma.CourseSectionAggregateArgs {
    return {
      where: { courseId },
      _max: { ordinal: true },
    };
  }
}
