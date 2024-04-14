import { UserService } from './user.service';
import {
  LoginUserDto,
  RegisterUserDto,
  UpdateUserPasswordDto,
  UpdateUserDto,
  CreateUserDto,
  AdminUpdateUserDto,
} from './dto/user.dto';
import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RequireLogin, RequirePermission, UserInfo } from 'src/utils/custom.decorator';
import { generateParseIntPipe } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 管理端去注册
  @Post('create')
  @RequireLogin()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 用户注册
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  // 用户登录
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser);
    return vo;
  }

  // 刷新token
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return this.userService.refresh(refreshToken);
  }

  // 获取用户信息
  @Get('info')
  @RequireLogin()
  async userInfo(@UserInfo('userId') userId: number) {
    return await this.userService.findUserDetailById(userId);
  }

  // 忘记密码
  @Post(['update_password', 'admin/update_password'])
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(passwordDto);
  }

  // 更新用户信息
  @Post(['update'])
  @RequireLogin()
  async updateUserInfo(@UserInfo('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserInfo(userId, updateUserDto);
  }

  @Post('admin/update')
  @RequireLogin()
  async adminUpdateUserInfo(@Body() updateUserDto: AdminUpdateUserDto) {
    if (!updateUserDto.id) throw new BadRequestException('id不能为空');
    return this.userService.adminUpdateUserInfo(+updateUserDto.id, updateUserDto);
  }

  @Get('freeze')
  @RequireLogin()
  async freezeUser(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId, true);
    return '冻结成功';
  }

  @Get('unfreeze')
  @RequireLogin()
  async noFreezeUser(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId, false);
    return '冻结成功';
  }

  @Get('list')
  @RequireLogin()
  async list(
    @Query('pageNo', generateParseIntPipe('pageNo')) pageNo: number,
    @Query('pageSize', generateParseIntPipe('pageSize')) pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
    @Query('isFrozen') isFrozen = false,
  ) {
    return await this.userService.findUsersByPage(pageNo, pageSize, username, nickName, email, isFrozen);
  }
}
