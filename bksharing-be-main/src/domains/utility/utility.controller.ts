import { Controller, Get, Query } from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UtilityEnumREQ } from './request/utility-enum.request';
import { UtilityService } from './utility.service';

@Controller('utilities')
@ApiTags('Utilities')
export class UtilityController {
  constructor(private readonly utilityService: UtilityService) {}

  @Get('enums')
  @ApiResponse({
    status: 200,
    description: 'Get all enums',
    example: {
      data: {
        SortOrder: ['asc', 'desc'],
        AccountType: ['STUDENT', 'MENTOR', 'ADMIN'],
        ActionFailed: ['ACCOUNT_NOT_FOUND', 'INCORRECT_PASSWORD', 'AUTH_PHONE_EXISTED', 'AUTH_EMAIL_EXISTED'],
      },
      message: 'OK',
    },
  })
  findAll(@Query() body: UtilityEnumREQ) {
    return this.utilityService.findAll(body);
  }
}
