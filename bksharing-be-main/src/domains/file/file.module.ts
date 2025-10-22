import { Global, Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Global()
@Module({
  imports: [CommonModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
