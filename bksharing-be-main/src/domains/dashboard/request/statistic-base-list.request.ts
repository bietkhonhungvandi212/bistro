import { IsEnum } from 'class-validator';
import { DateRangeFilter } from 'src/shared/enums/common.enum';

export class StatisticBaseListREQ {
  @IsEnum(DateRangeFilter)
  dateRange: DateRangeFilter = DateRangeFilter.ALL;
}
