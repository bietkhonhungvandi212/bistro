import { CourseStatus } from '@prisma/client';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { parseDateToEpoch } from 'src/shared/parsers/datetime.parse';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { CourseGetPayload } from 'src/shared/types/payload-prisma';

export class CourseAdminListRESP {
  id: number;
  name: string;
  status: CourseStatus;
  description: string;
  totalDuration: number;
  startDate: string;
  endDate: string;
  objectives: string[];
  targetAudiences: string[];
  prerequisite: string[];
  createdAt: string;
  noOfSubscriptions?: number; // paid subscriptions
  noOfFeedbacks?: number;
  rateOfCourse?: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  mentor: {
    id: number;
    name: string;
  };
  image?: ImageRESP;

  static fromEntity(
    e: CourseGetPayload,
    image: ImageRESP,
    data?: {
      noOfSubscriptions?: number;
      noOfFeedbacks?: number;
      rateOfCourse?: number;
    },
  ): CourseAdminListRESP {
    return {
      id: e.id,
      name: e.name,
      status: e.status,
      description: e.description,
      totalDuration: e.totalDuration,
      startDate: String(parseDateToEpoch(e.startDate)),
      endDate: orUndefinedWithCondition(!!e.endDate, String(parseDateToEpoch(e.endDate))),
      objectives: e.objectives,
      targetAudiences: e.targetAudiences,
      prerequisite: e.prerequisites,
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
      mentor: {
        id: e.Creator.id,
        name: e.Creator.name,
      },
    };
  }
}
