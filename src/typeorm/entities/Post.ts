import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Commentaire } from './Comment';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: true })
  isPending: boolean;
  @Column({ nullable: true })
  image: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @ManyToOne(() => User, (user) => user.posts, { eager: false })
  user: User;
  @OneToMany(() => Commentaire, (comment) => comment.post, {
    onDelete: 'CASCADE',
  })
  comments: Commentaire[];
  @ManyToMany(() => User)
  @JoinTable()
  likedBy: User[];
}
