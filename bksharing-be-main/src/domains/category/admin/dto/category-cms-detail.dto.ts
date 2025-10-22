import { Prisma } from '@prisma/client';
import { IS_ACTIVE_NESTED } from 'src/shared/constants/prisma.constant';

export class CategoryCMSDetailDTO {
  static findUnique(id: number): Prisma.CategoryFindUniqueOrThrowArgs {
    return {
      where: { id },
      include: { Courses: { where: IS_ACTIVE_NESTED } },
    };
  }
}
