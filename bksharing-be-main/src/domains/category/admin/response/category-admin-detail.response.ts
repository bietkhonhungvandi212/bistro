import { ImageRESP } from 'src/domains/image/response/image.response';
import { CategoryGetPayload } from '../../shared/types';

export class CategoryAdminDetailRESP {
  id: number;
  name: string;
  slug: string;
  description: string;
  noOfProduct: number;
  isRecommended: boolean;
  level: number;
  ordinal: number;
  thumbnail: ImageRESP;
  parentCategoryId: number | null;
  childCategories: CategoryAdminDetailRESP[];

  private constructor(e: CategoryGetPayload, thumbnail?: ImageRESP) {
    this.id = e.id;
    this.name = e.name;
    this.slug = e.slug;
    this.description = e.description;
    this.noOfProduct = e.Courses?.length || 0;
    this.level = e.level;
    this.ordinal = e.ordinal;
    this.isRecommended = e.isRecommended;
    this.thumbnail = thumbnail;
    this.parentCategoryId = e.parentCategoryId;
    this.childCategories = [];
  }

  static fromEntity(e: CategoryGetPayload, thumbnail?: ImageRESP): CategoryAdminDetailRESP {
    return new CategoryAdminDetailRESP(e, thumbnail);
  }

  addChildCategory(child: CategoryAdminDetailRESP) {
    this.childCategories.push(child);
  }
}
