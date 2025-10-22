import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { BaseResponse } from 'src/shared/generics/base.response';
import { CategoryAdminService } from './category-admin.service';
import { CategoryAdminCreateREQ } from './request/category-admin-create.request';
import { CategoryAdminListREQ } from './request/category-admin-list.request';
import { CategoryCmsReOrdinalREQ } from './request/category-admin-reordinal.request';
import { CategoryAdminUpdateREQ } from './request/category-admin-update.request';

@Controller('admin/categories')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryAdminService) {}

  @Get()
  async list(@Query() query: CategoryAdminListREQ) {
    return await this.categoryService.list(query);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body: CategoryAdminCreateREQ) {
    const category = await this.categoryService.create(body);
    return BaseResponse.of(category.id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: CategoryAdminUpdateREQ) {
    const category = await this.categoryService.update(id, body);
    return BaseResponse.of(category.id);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.delete(id);

    return BaseResponse.of(category.id);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.detail(id);

    return BaseResponse.of(category);
  }

  @Patch('re-ordinal')
  async rearrangeOrdinal(@Body() body: CategoryCmsReOrdinalREQ) {
    await this.categoryService.rearrangeOrdinal(body);
  }
}
