import { SubscriptionStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationREQ } from 'src/shared/generics/pagination.request';
import { NameValidator } from 'src/shared/request-validator/account.validator';

export class SubscriptionAdminListREQ extends PaginationREQ {
  @NameValidator()
  @IsOptional()
  mentorName?: string;

  @NameValidator()
  @IsOptional()
  courseName?: string;

  @NameValidator()
  @IsOptional()
  studentName?: string;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;
}
