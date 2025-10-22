import { Prisma } from '@prisma/client';

export type CourseGetPayload = Prisma.CourseGetPayload<{
  include: {
    Creator: true;
    Category: true;
    Image: true;
    Sections: true;
    MentorSchedules: true;
    _count: { select: { Sections: true; Subscriptions: true } };
  };
}>;

export type CourseSectionGetPayload = Prisma.CourseSectionGetPayload<{
  include: { Course: true; SectionAttachments: true };
}>;
