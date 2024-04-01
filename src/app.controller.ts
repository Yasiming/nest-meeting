import { Controller, Get } from '@nestjs/common';
import { RequireLogin, RequirePermission, UserInfo } from './utils/custom.decorator';

@Controller()
export class AppController {
  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  aaaa(@UserInfo() userInfo) {
    return userInfo;
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
