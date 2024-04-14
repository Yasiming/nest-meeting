import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '权限代码',
  })
  code: string;

  @Column({
    length: 100,
    comment: '权限描述',
  })
  description: string;

  @Column({ length: 20, comment: '菜单名称' })
  menuName: string;

  @Column({ length: 20, comment: '图标' })
  menuIcon: string;

  @Column({ length: 20, comment: '组件名称' })
  path: string;

  @Column({ comment: '父ID' })
  pid: number;

  @Column({ comment: '排序' })
  menuOrder: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
