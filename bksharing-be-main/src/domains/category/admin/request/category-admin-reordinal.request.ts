import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { CategoryErrorMessages } from 'src/shared/messages/error-messages';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class CategoryAdminOrdinalREQ {
  @IdValidator()
  categoryId: number;

  @IsNumber()
  @Min(1)
  ordinal: number;
}

export class CategoryCmsReOrdinalREQ {
  @IsArray()
  @Type(() => CategoryAdminOrdinalREQ)
  @ValidateNested({ each: true })
  categoryOrdinals: CategoryAdminOrdinalREQ[];

  @IsOptional()
  @IdValidator()
  parentCategoryId: number;

  static toFindByOrdinal(categoryIds: number[], ordinal: number, parentCategoryId?: number): Prisma.CategoryFindFirstArgs {
    const isRearrangeParent = Boolean(parentCategoryId);

    return {
      where: {
        id: { notIn: categoryIds },
        ordinal: ordinal,
        ...(isRearrangeParent ? { level: 1 } : { parentCategoryId: parentCategoryId }),
      },
      select: { id: true },
    };
  }

  static toFindBySubCategoryOrdinal(
    categoryIds: number[],
    ordinal: number,
    parentCategoryId: number,
  ): Prisma.CategoryFindFirstArgs {
    return {
      where: { id: { notIn: categoryIds }, ordinal: ordinal, parentCategoryId: parentCategoryId },
      select: { id: true },
    };
  }

  static validateOrdinal(body: CategoryCmsReOrdinalREQ) {
    const ordinals = body.categoryOrdinals.map(({ ordinal }) => ordinal);

    const hasDuplicates = ordinals.length !== new Set(ordinals).size;
    if (hasDuplicates) throw new ActionFailedException(ActionFailed.CATEGORY_ORDINAL_OVERLAP, CategoryErrorMessages.MSG03);
  }

  static toUpdateOrdinal(body: CategoryAdminOrdinalREQ): Prisma.CategoryUpdateArgs {
    return {
      where: { id: body.categoryId },
      data: { ordinal: body.ordinal },
    };
  }
}
