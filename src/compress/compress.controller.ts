import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express, Response } from 'express';
import { existsSync } from 'fs';
import * as sharp from 'sharp';

@Controller('compress')
export class CompressController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          const path = Date.now() + '-' + Math.round(Math.random() * 1e10) + extname(file.originalname);
          callback(null, path);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file.path;
  }

  @Get('compress')
  async compress(@Query('path') filePath: string, @Query('color', ParseIntPipe) color: number, @Res() res: Response) {
    if (!existsSync(filePath)) {
      throw new BadRequestException('文件不存在');
    }
    const data = await sharp(filePath, {
      animated: true,
      limitInputPixels: false,
    })
      .gif({
        colours: color,
      })
      .toBuffer();
    res.set('Content-Disposition', `attachment; filename="dest.gif"`);
    res.send(data);
  }
}
