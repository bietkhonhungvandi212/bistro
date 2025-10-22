import { Prisma } from '@prisma/client';

export class FileLinkDTO {
  static fileSelect(): Prisma.FileSelect {
    return {
      ImageVersions: { select: { id: true } },
      Categories: { select: { id: true } },
      CourseImages: { select: { id: true } },
      SectionAttachments: { select: { fileId: true } },
    };
  }

  static isLinked(
    e: Prisma.FileGetPayload<{
      include: { ImageVersions: true; Categories: true; AccountAvatars: true; CourseImages: true; SectionAttachments: true };
    }>,
  ) {
    return (
      e.ImageVersions?.length > 0 ||
      e.Categories?.length > 0 ||
      e.AccountAvatars?.length > 0 ||
      e.CourseImages?.length > 0 ||
      e.SectionAttachments?.length > 0
    );
  }
}
