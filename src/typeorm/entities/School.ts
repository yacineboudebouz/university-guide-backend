import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';
import { Photo } from './Photo';
import { Rating } from './Rating';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  image: string;
  @Column()
  phoneNumber: string;
  @OneToMany(() => Photo, (photo) => photo.school)
  photos: Photo[];
  @ManyToMany(() => User)
  @JoinTable()
  teachers: User[];
  @ManyToMany(() => User)
  @JoinTable()
  students: User[];
  @OneToMany(() => Rating, (rating) => rating.school)
  ratings: Rating[];
}
