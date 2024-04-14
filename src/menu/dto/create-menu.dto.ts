import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty({ message: '菜单名称不能为空' })
  menuName: string;

  menuIcon: string;

  code: string;

  description: string;

  path: string;

  pid: string;

  menuOrder: number;
}
