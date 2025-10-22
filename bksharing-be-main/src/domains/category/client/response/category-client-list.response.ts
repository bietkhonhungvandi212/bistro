import { ImageRESP } from 'src/domains/image/response/image.response';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { CategoryGetPayload } from '../../shared/types';

export class CategoryClientListRESP {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail: ImageRESP;
  noOfCourses: number;
  createdAt: string;
  parentCategoryId: number | null;
  childCategories: CategoryClientListRESP[];

  private constructor(e: CategoryGetPayload, noOfCourses?: number, thumbnail?: ImageRESP) {
    this.id = e.id;
    this.name = e.name;
    this.slug = e.slug;
    this.description = e.description;
    this.thumbnail = thumbnail;
    this.parentCategoryId = e.parentCategoryId;
    this.noOfCourses = noOfCourses || 0;
    this.createdAt = parseEpoch(e.createdAt);
    this.childCategories = [];
  }

  static fromEntity(e: CategoryGetPayload, noOfCourses?: number, thumbnail?: ImageRESP): CategoryClientListRESP {
    return new CategoryClientListRESP(e, noOfCourses, thumbnail);
  }

  addChildCategory(child: CategoryClientListRESP) {
    this.childCategories.push(child);
  }
}
