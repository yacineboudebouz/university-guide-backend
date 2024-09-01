import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Commentaire {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  comment: string;
  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}
