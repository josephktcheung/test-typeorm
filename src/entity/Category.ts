import { Entity, PrimaryGeneratedColumn, Column, Tree, OneToMany, ManyToOne, TreeChildren, TreeParent } from 'typeorm';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  // @OneToMany(() => Category, category => category.parent)
  @TreeChildren()
  children: [Category];

  // @ManyToOne(() => Category, category => category.children)
  @TreeParent()
  parent: Category
}
