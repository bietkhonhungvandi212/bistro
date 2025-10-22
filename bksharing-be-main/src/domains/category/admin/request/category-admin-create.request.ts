import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { MAX_CATEGORY_LEVEL } from 'src/shared/constants/category.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { generateSlug } from 'src/shared/helpers/category.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { CategoryErrorMessages } from '../../../../shared/messages/error-messages';

export class CategoryAdminCreateREQ {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IdValidator()
  parentCategoryId?: number;

  @IsOptional()
  @IsNumber()
  fileId?: number;

  static toFindMaxOrdinal(parentCategoryId?: number): Prisma.CategoryAggregateArgs {
    return {
      where: parentCategoryId ? { parentCategoryId: parentCategoryId } : { parentCategoryId: { equals: null } },
      _max: { ordinal: true },
    };
  }

  static toCreateInput(body: CategoryAdminCreateREQ, level: number, maxOrdinal: number): Prisma.CategoryCreateInput {
    if (level > MAX_CATEGORY_LEVEL)
      throw new ActionFailedException(ActionFailed.CATEGORY_LEVEL_EXCEED_MAXIMUM, CategoryErrorMessages.MSG01);

    return {
      name: body.name,
      slug: generateSlug(body.name),
      description: body.description,
      ordinal: maxOrdinal + 1,
      level,
      ParentCategory: connectRelation(body.parentCategoryId),
    };
  }
}
