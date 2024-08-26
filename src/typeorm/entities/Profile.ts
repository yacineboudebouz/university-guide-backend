import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './School';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  dateOfBirth: Date;
  @Column()
  phoneNumber: string;
  @Column()
  education: string;
  @Column()
  profilePicture: string;
  @Column()
  bio: string;
}
