import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './Profile';
import { Post } from './Post';
import { Commentaire } from './Comment';
import { Rating } from './Rating';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  createdAt: Date;

  @OneToOne(() => Profile, { eager: false })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @OneToMany(() => Rating, (rating) => rating.user, {
    onDelete: 'CASCADE',
  })
  ratings: Rating[];
  posts: Post[];
  @OneToMany(() => Commentaire, (comment) => comment.user, {
    eager: false,
    onDelete: 'CASCADE',
  })
  comments: Commentaire[];
}
//
