import { Injectable } from '@nestjs/common';
import { CourseStatus } from '@prisma/client';
import { isEmpty } from 'class-validator';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { ImageService } from 'src/domains/image/image.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { addCreationTimestamps } from 'src/shared/helpers/add-timestamp.helper';
import { CategoryErrorMessages } from 'src/shared/messages/error-messages';
import { CategoryGetPayload } from '../shared/types';
import { CategoryClientStatisticsDTO } from './dto/category-client-statistics.dto';
import { CategoryClientListREQ } from './request/category-client-list.request';
import { CategoryClientSelectInterestedChoiceREQ } from './request/category-client-select-interested-choice.request';
import { CategoryClientListRESP } from './response/category-client-list.response';
import { CategoryClientStatisticsRESP } from './response/category-client-statistics.response';

@Injectable()
export class CategoryClientService {
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
  ) {}

  async statistics() {
    const categories = await this.transactionHost.tx.category.findMany(CategoryClientStatisticsDTO.toFindMany());
    return PaginationResponse.of(categories.map(CategoryClientStatisticsRESP.fromEntity));
  }

  async list(query: CategoryClientListREQ) {
    const condition = CategoryClientListREQ.toQueryCondition(query);
    const count = await this.transactionHost.tx.category.count({ where: condition });
    const categories = await this.transactionHost.tx.category.findMany(CategoryClientListREQ.toFindMany(query));
    const cateResponses = await Promise.all(
      categories.map(async (c: CategoryGetPayload) => {
        const noOfCourses = await this.transactionHost.tx.course.count({
          where: { categoryId: c.id, isPublic: true, status: CourseStatus.APPROVED },
        });

        return CategoryClientListRESP.fromEntity(c, noOfCourses, await this.imageService.getImageOriginal(c.imageId));
      }),
    );

    // if just getting category, should return list of sub category
    // if (query.isRecommended) return PaginationResponse.ofWithTotal<CategoryClientListRESP>(cateResponses, count);

    cateResponses.forEach((r) => {
      const parent = cateResponses.find((c) => c.id === r.parentCategoryId);
      if (parent) parent.addChildCategory(r);
    });

    const parentCateResponses = cateResponses.filter((r) => r.parentCategoryId === null);
    return PaginationResponse.ofWithTotal<CategoryClientListRESP>(parentCateResponses, count);
  }

  async getInterestedCategories(user: AuthUserDTO) {
    const interestedCategories = await this.transactionHost.tx.userInterestedCategory.findMany({
      where: { userId: user.accountId },
      include: { Category: true },
    });

    const parentCategorieIds = new Set<number>();

    interestedCategories.forEach((c) => {
      if (c.Category.parentCategoryId) parentCategorieIds.add(c.Category.parentCategoryId);
    });

    const parentCategories = await this.transactionHost.tx.category.findMany({
      where: { id: { in: Array.from(parentCategorieIds) } },
    });

    const parentCategoriesResponse = await Promise.all(
      parentCategories.map(async (c: CategoryGetPayload) =>
        CategoryClientListRESP.fromEntity(c, 0, await this.imageService.getImageOriginal(c.imageId)),
      ),
    );

    const cateResponses = await Promise.all(
      interestedCategories.map(async (c) => {
        return CategoryClientListRESP.fromEntity(
          c.Category as CategoryGetPayload,
          0,
          await this.imageService.getImageOriginal(c.Category.imageId),
        );
      }),
    );

    cateResponses.forEach((r) => {
      const parent = parentCategoriesResponse.find((c) => c.id === r.parentCategoryId);
      if (parent) parent.addChildCategory(r);
    });

    return parentCategoriesResponse;
  }

  async chooseInterestedCategories(user: AuthUserDTO, body: CategoryClientSelectInterestedChoiceREQ) {
    await this.validateCategories(body);
    await this.transactionHost.tx.userInterestedCategory.createMany({
      data: body.categoryIds.map((categoryId) =>
        addCreationTimestamps({
          userId: user.accountId,
          categoryId: categoryId,
        }),
      ),
      skipDuplicates: true,
    });
  }

  async validateCategories(body: CategoryClientSelectInterestedChoiceREQ) {
    if (!body.categoryIds || isEmpty(body.categoryIds)) return;
    const categories = await this.transactionHost.tx.category.findMany({ where: { id: { in: body.categoryIds } } });
    if (categories.length !== body.categoryIds.length)
      throw new ActionFailedException(ActionFailed.CATEGORY_NOT_FOUND, CategoryErrorMessages.MSG05);
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async updateCategoryOrdinal() {
    const parentCategories = await this.transactionHost.tx.category.findMany({ where: { level: 1 }, select: { id: true } });
    const parentIds = parentCategories.map((cate) => cate.id);

    for (const [index, parentId] of parentIds.entries()) {
      await this.transactionHost.tx.category.update({
        where: { id: parentId },
        data: { ordinal: index + 1 },
      });
      const childrenCategories = await this.transactionHost.tx.category.findMany({
        where: { parentCategoryId: parentId },
        select: { id: true },
      });
      for (const [index, child] of childrenCategories.entries()) {
        await this.transactionHost.tx.category.update({
          where: { id: child.id },
          data: { ordinal: index + 1 },
        });
      }
    }
  }
}
