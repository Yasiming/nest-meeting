import { Request } from 'express';
import {
  SetMetadata,
  applyDecorators,
  UnsupportedMediaTypeException,
  UseInterceptors,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const RequireLogin = () => SetMetadata('require-login', true);

export const RequirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions);

export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  if (!request.user) {
    return null;
  }
  return data ? request.user[data] : request.user;
});

//上传类型验证
export function filterFilter(type: string) {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!file.mimetype.includes(type)) {
      callback(new UnsupportedMediaTypeException('文件类型错误'), false);
    } else {
      callback(null, true);
    }
  };
}

//文件上传
export function Upload(field = 'file', options: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(field, options)));
}

//图片上传
export function Image(field = 'file') {
  return Upload(field, {
    //上传文件大小限制
    limits: { fileSize: Math.pow(1024, 2) * 4 },
    fileFilter: filterFilter('image'),
  } as MulterOptions);
}

//文档上传
export function Document(field = 'file') {
  return Upload(field, {
    //上传文件大小限制
    limits: Math.pow(1024, 2) * 5,
    fileFilter: filterFilter('document'),
  } as MulterOptions);
}
