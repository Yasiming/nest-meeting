import { BadRequestException, Controller, Post, UploadedFile } from '@nestjs/common';
import { Image } from 'src/utils/custom.decorator';

@Controller('upload')
export class UploadController {
  @Post('image')
  @Image()
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file?.path) {
      throw new BadRequestException('上传失败，请检测参数');
    }
    return file?.path;
  }
}
