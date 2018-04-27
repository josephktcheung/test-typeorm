import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable, Tree, TreeParent, TreeChildren } from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeParent()
  parent: Category;

  @TreeChildren()
  children: Category[];
}
