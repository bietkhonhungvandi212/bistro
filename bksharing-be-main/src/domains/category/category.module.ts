import { Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { CategoryAdminController } from './admin/category-admin.controller';
import { CategoryAdminService } from './admin/category-admin.service';
import { CategoryClientController } from './client/category-client.controller';
import { CategoryClientService } from './client/category-client.service';

@Module({
  imports: [CommonModule],
  controllers: [CategoryAdminController, CategoryClientController],
  providers: [CategoryAdminService, CategoryClientService],
})
export class CategoryModule {}
