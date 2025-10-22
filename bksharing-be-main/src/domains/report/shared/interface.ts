import { ReportType } from '@prisma/client';

export interface ReportCreateInterface {
  type: ReportType;
  description: string;
}
