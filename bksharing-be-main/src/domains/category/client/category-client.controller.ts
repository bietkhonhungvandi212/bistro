import { Body, Controller, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Public } from 'src/domains/auth/auth-public.decorator';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { CategoryClientService } from './category-client.service';
import { CategoryClientListREQ } from './request/category-client-list.request';
import { CategoryClientSelectInterestedChoiceREQ } from './request/category-client-select-interested-choice.request';

@Controller('client/categories')
@UseGuards(AuthJwtGuard)
export class CategoryClientController {
  constructor(private readonly categoryEcmService: CategoryClientService) {}

  @Get()
  @Public()
  async list(@Query() query: CategoryClientListREQ) {
    return await this.categoryEcmService.list(query);
  }

  @Get('interested')
  async getInterestedCategories(@Req() req: AuthRequestDTO) {
    return await this.categoryEcmService.getInterestedCategories(req.user);
  }

  @Patch('update-ordinal')
  async updateCategoryOrdinal() {
    await this.categoryEcmService.updateCategoryOrdinal();
  }

  @Post('students')
  async chooseInterestedCategories(@Req() req: AuthRequestDTO, @Body() body: CategoryClientSelectInterestedChoiceREQ) {
    await this.categoryEcmService.chooseInterestedCategories(req.user, body);
    return BaseResponse.ok();
  }

  @Get('statistics')
  async statistics() {
    return await this.categoryEcmService.statistics();
  }
}
