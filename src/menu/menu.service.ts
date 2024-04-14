import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Permission } from 'src/user/entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Permission) private menuRepository: Repository<Permission>) {}

  async create(createMenuDto: CreateMenuDto) {
    const permission = new Permission();
    permission.code = createMenuDto.code || '';
    permission.menuIcon = createMenuDto.menuIcon || '';
    permission.menuName = createMenuDto.menuName;
    permission.description = createMenuDto.description || '';
    permission.path = createMenuDto.path || '';
    permission.pid = +createMenuDto.pid || 0;
    permission.menuOrder = createMenuDto.menuOrder || 0;
    await this.menuRepository.save(permission);
    return '添加成功';
  }

  async findAll() {
    return this.menuRepository.find({
      order: {
        menuOrder: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  async update(updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuRepository.findOneBy({
      id: +updateMenuDto.id,
    });
    if (!menu) {
      throw new BadRequestException('更新错误，没有此项数据');
    }
    Object.assign(menu, updateMenuDto);

    console.log('menu', menu);

    return this.menuRepository.save(menu);
  }

  async remove(id: number) {
    const res = await this.menuRepository.findOne({
      where: {
        pid: id,
      },
    });
    if (res) {
      throw new BadRequestException('还存在子级，不能删除');
    }

    await this.menuRepository.delete(id);
    return '已删除';
  }
}
