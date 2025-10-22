import { ArrayMinSize, IsNumber } from 'class-validator';

export class CategoryClientSelectInterestedChoiceREQ {
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  categoryIds?: number[] = [];
}
