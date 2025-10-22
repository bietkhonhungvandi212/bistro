import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [FileModule, PrismaModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
@Global()
export class ImageModule {}
