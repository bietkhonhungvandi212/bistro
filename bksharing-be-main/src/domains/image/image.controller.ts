import { Controller } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('/images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // @Get()
  // async list(@Query() query: CategoryListREQ) {
  //   return await this.categoryService.list(query);
  // }

  // @Get(':id')
  // async detail(@Param('id', ParseIntPipe) id: number) {
  //   return this.categoryService.detail(id);
  // }
}
