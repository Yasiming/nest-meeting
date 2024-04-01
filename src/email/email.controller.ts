import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from '../redis/redis.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isEmail } from 'src/utils';
import { RequireLogin, UserInfo } from 'src/utils/custom.decorator';

@ApiTags('注册验证码')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService, private readonly redisService: RedisService) {}

  @ApiQuery({ name: 'address', type: String, description: '邮箱地址', required: true, example: 'xxx@xx.com' })
  @ApiResponse({ status: HttpStatus.OK, description: '发送成功', type: String })
  @ApiOperation({ summary: '注册验证码' })
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    isEmail(address);
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Get('update-user-captcha')
  @RequireLogin()
  async updateUserCaptcha(@UserInfo('email') address: string) {
    isEmail(address);
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`update_user_captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '更新用户信息验证码',
      html: `<p>你的更新用户信息验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    isEmail(address);
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是 ${code}</p>`,
    });
  }
}
