import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  image: string;
  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
