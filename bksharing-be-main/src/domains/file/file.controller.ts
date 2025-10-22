import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseResponse } from 'src/shared/generics/base.response';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { Public } from '../auth/auth-public.decorator';
import { AuthRequestDTO } from '../auth/dto/auth-request.dto';
import { FileService } from './file.service';
import { FileUploadSignedUrlREQ } from './request/file-upload-signed-url.request';

@Controller('files')
@UseGuards(AuthJwtGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Req() req: AuthRequestDTO, @UploadedFile() file: Express.Multer.File) {
    const asset = await this.fileService.uploadFile(req.user, file, req.body);

    return BaseResponse.of(asset);
  }

  @Public()
  @Post('signed-url')
  async createSignedUrl(@Body() body: FileUploadSignedUrlREQ) {
    const response = await this.fileService.createSignedFile(body);

    return BaseResponse.of(response);
  }
}
