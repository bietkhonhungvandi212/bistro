import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UtilityEnumREQ {
  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @ApiPropertyOptional({
    type: [String],
    description: 'List of keys to get',
    example: ['SortOrder', 'AccountType', 'ActionFailed'],
  })
  keys: string[] = [];
}
