import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

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
}
