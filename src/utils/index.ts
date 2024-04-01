import { BadRequestException, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function generateParseIntPipe(name: string) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + '应该传数字');
    },
  });
}

export function isEmail(input: string) {
  const emailPattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!emailPattern.test(input)) {
    throw new HttpException('请输入正确邮箱', HttpStatus.BAD_REQUEST);
  } else {
    return true;
  }
}
