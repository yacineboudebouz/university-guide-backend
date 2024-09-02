import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from 'src/typeorm/entities/School';
import { User } from 'src/typeorm/entities/User';
import { Rating } from 'src/typeorm/entities/Rating';
import { Photo } from 'src/typeorm/entities/Photo';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'src/typeorm/entities/Profile';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, AuthService, JwtService],
  imports: [TypeOrmModule.forFeature([School, User, Photo, Rating, Profile])],
})
export class SchoolModule {}
