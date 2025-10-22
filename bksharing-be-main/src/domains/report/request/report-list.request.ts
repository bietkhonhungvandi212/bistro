import { ReportStatus, ReportType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationREQ } from 'src/shared/generics/pagination.request';

export class ReportListREQ extends PaginationREQ {
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

  @IsEnum(ReportType)
  @IsOptional()
  type?: ReportType;

  @IsOptional()
  @IsString()
  reporterName?: string;
}
