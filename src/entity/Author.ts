import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Author {
  @PrimaryGeneratedColumn() id: number;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @Column() name: string;
}