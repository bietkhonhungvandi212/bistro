import { ImageRESP } from 'src/domains/image/response/image.response';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { CategoryGetPayload } from '../../shared/types';

export class CategoryAdminListRESP {
  id: number;
  name: string;
  slug: string;
  description: string;
  level: number;
  ordinal: number;
  thumbnail: ImageRESP;
  createdAt: string;
  noOfCourse: number;
  parentCategoryId: number | null;
  childCategories: CategoryAdminListRESP[] = [];

  static fromEntity(e: CategoryGetPayload, noOfCourse: number, thumbnail?: ImageRESP): CategoryAdminListRESP {
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description,
      level: e.level,
      ordinal: e.ordinal,
      thumbnail: thumbnail,
      noOfCourse: noOfCourse || 0,
      createdAt: parseEpoch(e.createdAt),
      parentCategoryId: e.parentCategoryId,
      childCategories: [],
    };
  }

  static addChildCategory(child: CategoryAdminListRESP) {
    const childCategories: CategoryAdminListRESP[] = [];
    childCategories.push(child);
    return childCategories;
  }
}
