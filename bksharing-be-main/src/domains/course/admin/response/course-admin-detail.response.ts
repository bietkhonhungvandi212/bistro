import { CourseStatus, TargetAudience } from '@prisma/client';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { parsePrismaDateToEpoch } from 'src/shared/parsers/datetime.parse';
import { orNull } from 'src/shared/parsers/io.parser';
import { CourseGetPayload } from 'src/shared/types/payload-prisma';
import { CourseSectionDTO } from '../../dto/course-section.dto';

export class CourseAdminDetailRESP {
  id: number;
  name: string;
  status: CourseStatus;
  description: string;
  totalDuration: number;
  price: number;
  isPublic: boolean;
  startDate: string;
  endDate: string;
  litmitOfStudents: number;
  category: {
    id: number;
    name: string;
  };
  createdAt: Date;
  objectives: string[];
  targetAudiences: TargetAudience[];
  prerequisites: string[];
  sections: CourseSectionDTO[];
  image: ImageRESP;

  static fromEntity(course: CourseGetPayload, sections: CourseSectionDTO[], image: ImageRESP): CourseAdminDetailRESP {
    return {
      id: course.id,
      name: course.name,
      status: course.status,
      description: course.description,
      totalDuration: course.totalDuration,
      price: parseDecimalNumber(course.price),
      isPublic: course.isPublic,
      startDate: parsePrismaDateToEpoch(course.startDate),
      endDate: parsePrismaDateToEpoch(course.endDate),
      objectives: course.objectives,
      targetAudiences: course.targetAudiences,
      prerequisites: course.prerequisites,
      litmitOfStudents: course.litmitOfStudents,
      sections: sections,
      image: orNull(image),
      category: {
        id: course.Category?.id,
        name: course.Category?.name,
      },
      createdAt: parseEpoch(course.createdAt),
    };
  }
}
