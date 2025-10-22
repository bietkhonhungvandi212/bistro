import { CourseStatus } from '@prisma/client';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { parseDateToEpoch } from 'src/shared/parsers/datetime.parse';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { CourseGetPayload } from 'src/shared/types/payload-prisma';
import { CourseMentorDetailRESP } from '../../shared/types';

export class CourseClientListRESP {
  id: number;
  name: string;
  status: CourseStatus;
  description: string;
  totalDuration: number;
  startDate: string;
  endDate: string;
  limitOfStudents: number;
  objectives: string[];
  targetAudiences: string[];
  prerequisite: string[];
  countOfSections: number;
  price: number;
  createdAt: string;
  noOfSubscriptions?: number; // paid subscriptions
  noOfFeedbacks?: number;
  rateOfCourse?: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  mentor: CourseMentorDetailRESP;
  image?: ImageRESP;

  static fromEntity(
    e: CourseGetPayload,
    image: ImageRESP,
    mentor: CourseMentorDetailRESP,
    data?: {
      noOfSubscriptions?: number;
      noOfFeedbacks?: number;
      rateOfCourse?: number;
    },
  ): CourseClientListRESP {
    return {
      id: e.id,
      name: e.name,
      status: e.status,
      description: e.description,
      price: parseDecimalNumber(e.price),
      totalDuration: e.totalDuration,
      limitOfStudents: e.litmitOfStudents,
      startDate: String(parseDateToEpoch(e.startDate)),
      endDate: orUndefinedWithCondition(!!e.endDate, String(parseDateToEpoch(e.endDate))),
      objectives: e.objectives,
      targetAudiences: e.targetAudiences,
      prerequisite: e.prerequisites,
      countOfSections: e._count.Sections,
      image: image,
      createdAt: parseEpoch(e.createdAt),
      noOfSubscriptions: data?.noOfSubscriptions ?? 0,
      noOfFeedbacks: data?.noOfFeedbacks ?? 0,
      rateOfCourse: data?.rateOfCourse ?? 0,
      category: {
        id: e.Category.id,
        name: e.Category.name,
        slug: e.Category.slug,
      },
      mentor: mentor,
    };
  }
}
