import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Author } from "./Author";

@Entity()
export class Post {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => Author, author => author.posts)
  author: Author;

  @Column() text: string;
}