import { CategoryClientStatisticsCountPayload } from '../dto/category-client-statistics.dto';

export class CategoryClientStatisticsRESP {
  id: number;
  name: string;
  level: number;
  noOfProducts?: number;
  childrenCategories: Partial<CategoryClientStatisticsRESP>[];

  static fromEntity(e: CategoryClientStatisticsCountPayload): CategoryClientStatisticsRESP {
    return {
      id: e.id,
      name: e.name,
      level: e.level,
      childrenCategories: e.ChildrenCategories.map((category: CategoryClientStatisticsCountPayload) => ({
        id: category.id,
        name: category.name,
        level: category.level,
        noOfProducts: category._count.Products,
      })),
    };
  }
}
