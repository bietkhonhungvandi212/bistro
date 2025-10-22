import { Prisma } from '@prisma/client';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { isNull } from 'lodash';
import { MAX_CATEGORY_LEVEL } from 'src/shared/constants/category.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { generateSlug } from 'src/shared/helpers/category.helper';
import { connectRelation, removeRelation } from 'src/shared/helpers/prisma.helper';
import { CategoryErrorMessages } from 'src/shared/messages/error-messages';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class CategoryAdminUpdateREQ {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

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

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

  static toUpdateInput(body: CategoryAdminUpdateREQ, level: number): Prisma.CategoryUpdateInput {
    if (level > MAX_CATEGORY_LEVEL)
      throw new ActionFailedException(ActionFailed.CATEGORY_LEVEL_EXCEED_MAXIMUM, CategoryErrorMessages.MSG01);

    return {
      name: body.name,
      slug: generateSlug(body.name),
      description: body.description,
      level,
      ParentCategory: isNull(body.parentCategoryId) ? removeRelation() : connectRelation(body.parentCategoryId),
      isRecommended: body.isRecommended,
    };
  }
}
