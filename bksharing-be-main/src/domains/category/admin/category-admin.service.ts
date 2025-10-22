import { Injectable } from '@nestjs/common';
import { CourseStatus, Prisma, PrismaClient } from '@prisma/client';

import { isUndefined } from 'lodash';
import { ImageService } from 'src/domains/image/image.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { CategoryErrorMessages } from 'src/shared/messages/error-messages';
import { CategoryGetPayload } from '../shared/types';
import { CategoryCMSDetailDTO } from './dto/category-cms-detail.dto';
import { CategoryAdminCreateREQ } from './request/category-admin-create.request';
import { CategoryAdminListREQ } from './request/category-admin-list.request';
import { CategoryCmsReOrdinalREQ } from './request/category-admin-reordinal.request';
import { CategoryAdminUpdateREQ } from './request/category-admin-update.request';
import { CategoryAdminDetailRESP } from './response/category-admin-detail.response';
import { CategoryAdminListRESP } from './response/category-admin-list.response';

@Injectable()
export class CategoryAdminService {
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
  ) {}

  async findCategoryLevel(categoryParentId?: number) {
    if (!categoryParentId) return 1;
    const parent = await this.transactionHost.tx.category.findUniqueOrThrow({
      where: { id: categoryParentId },
      select: { level: true },
    });
    return parent.level + 1;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async linkImageToCategory(categoryId: number, fileId: number) {
    //   /* 1. Remove old image */
    const category = await this.transactionHost.tx.category.findUniqueOrThrow({
      where: { id: categoryId },
      select: { Image: { select: { id: true } } },
    });
    if (category.Image) await this.imageService.deleteImage(category.Image.id);

    //   /* 2. Create and link image */
    await this.transactionHost.tx.category.update({
      where: { id: categoryId },
      data: { Image: connectRelation(fileId) },
    });

    /* 3. Enable Image & File */
    await this.imageService.enableImages([fileId]);
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async create(body: CategoryAdminCreateREQ) {
    /* 1. Check if attachment uploaded & create image */
    if (body.fileId) await this.imageService.verifyImages([body.fileId]);

    const level = await this.findCategoryLevel(body.parentCategoryId);
    const ordinal = await this.transactionHost.tx.category.aggregate(
      CategoryAdminCreateREQ.toFindMaxOrdinal(body.parentCategoryId),
    );

    const maxOrdinal = ordinal._max.ordinal || 0;
    /* 2. Create and link image */
    const category = await this.transactionHost.tx.category.create({
      data: CategoryAdminCreateREQ.toCreateInput(body, level, maxOrdinal),
      select: { id: true },
    });

    if (body.fileId) await this.linkImageToCategory(category.id, body.fileId);

    return category;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async update(id: number, body: CategoryAdminUpdateREQ) {
    /* 1. Check if attachment uploaded & create image */
    // if (body.fileId) await this.imageService.verifyImages([body.fileId]);

    const category = await this.transactionHost.tx.category.findUniqueOrThrow({ where: { id } });
    const parentCategoryId = isUndefined(body.parentCategoryId) ? category.parentCategoryId : body.parentCategoryId;
    const level = await this.findCategoryLevel(parentCategoryId);

    /* 2. Update and link image */
    const updatedCategory = await this.transactionHost.tx.category.update({
      where: { id },
      data: CategoryAdminUpdateREQ.toUpdateInput(body, level),
      select: { id: true },
    });

    // if (body.fileId) await this.linkImageToCategory(category.id, body.fileId, tx);

    return updatedCategory;
  }

  async list(query: CategoryAdminListREQ) {
    const condition = CategoryAdminListREQ.toQueryCondition(query);
    const count = await this.transactionHost.tx.category.count({ where: condition });
    const categories = await this.transactionHost.tx.category.findMany(CategoryAdminListREQ.toFindMany(query));
    const cateResponses = await Promise.all(
      categories.map(async (c: CategoryGetPayload) => {
        const noOfCourses = await this.transactionHost.tx.course.count({
          where: { categoryId: c.id, isPublic: true, status: CourseStatus.APPROVED },
        });

        return CategoryAdminListRESP.fromEntity(c, noOfCourses, await this.imageService.getImageOriginal(c.imageId));
      }),
    );

    cateResponses.forEach((r) => {
      if (r.parentCategoryId) {
        const parent = cateResponses.find((c) => c.id === r.parentCategoryId);
        parent.childCategories.push(r);
      }
    });

    const parentCateResponses = cateResponses.filter((r) => r.parentCategoryId === null);
    return PaginationResponse.ofWithTotal<CategoryAdminListRESP>(parentCateResponses, count);
  }

  async detail(id: number) {
    const category = (await this.transactionHost.tx.category.findUniqueOrThrow(
      CategoryCMSDetailDTO.findUnique(id),
    )) as CategoryGetPayload;
    const childCategories = await this.transactionHost.tx.category.findMany({ where: { parentCategoryId: id } });
    const childCateResponses = await Promise.all(
      childCategories.map(async (c: CategoryGetPayload) =>
        CategoryAdminDetailRESP.fromEntity(c, await this.imageService.getImageOriginal(c.imageId)),
      ),
    );

    const cateResponse = CategoryAdminDetailRESP.fromEntity(category);
    cateResponse.childCategories = childCateResponses;
    return cateResponse;
  }

  async delete(id: number) {
    const category = await this.transactionHost.tx.category.findUniqueOrThrow({ where: { id }, select: { id: true } });
    const childCategories = await this.transactionHost.tx.category.findMany({ where: { parentCategoryId: id } });

    if (childCategories.length > 0)
      throw new ActionFailedException(ActionFailed.CATEGORY_PARENT_DELETE_FAILED, CategoryErrorMessages.MSG04);

    /* Delete parent & children categories */
    const categoryIds = [category.id, ...childCategories.map((c) => c.id)];
    await this.transactionHost.tx.$executeRaw`DELETE FROM categories WHERE id IN (${Prisma.join(categoryIds)})`;
    return category;
  }

  private async validateExistedOrdinal(body: CategoryCmsReOrdinalREQ) {
    const rearrangedCategoryIds = body.categoryOrdinals.map(({ categoryId }) => categoryId);

    for (const category of body.categoryOrdinals) {
      const existedCategory = await this.transactionHost.tx.category.findFirst(
        CategoryCmsReOrdinalREQ.toFindByOrdinal(rearrangedCategoryIds, category.ordinal, body.parentCategoryId),
      );

      if (existedCategory)
        throw new ActionFailedException(
          ActionFailed.CATEGORY_ORDINAL_OVERLAP,
          `Ordinal number ${category.ordinal} already existed with banner ${existedCategory.id}`,
        );
    }
  }

  async rearrangeOrdinal(body: CategoryCmsReOrdinalREQ) {
    CategoryCmsReOrdinalREQ.validateOrdinal(body);
    await this.validateExistedOrdinal(body);

    await this.transactionHost.tx.$transaction(async (tx: PrismaClient) => {
      for (const category of body.categoryOrdinals) {
        await tx.category.update(CategoryCmsReOrdinalREQ.toUpdateOrdinal(category));
      }
    });
  }
}
