import { ReportStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReportResolveBaseREQ {
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  resolution: string;
}
