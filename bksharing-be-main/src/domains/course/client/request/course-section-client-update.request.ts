import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsOptional } from 'class-validator';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { CourseSectionDTO } from '../../dto/course-section.dto';

export class CourseSectionUpdateDTO extends PartialType(CourseSectionDTO) {}

export class CourseSectionAddREQ extends CourseSectionDTO {}

export class CourseSectionRemoveREQ {
  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @ArrayMinSize(COMMON_CONSTANT.ARRAY_MIN_SIZE)
  removeSectionIds: number[] = [];
}
