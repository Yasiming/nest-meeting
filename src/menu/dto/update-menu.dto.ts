import { PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;
  @IsNotEmpty({ message: '菜单名称不能为空' })
  menuName: string;

  menuOrder: number;
}
