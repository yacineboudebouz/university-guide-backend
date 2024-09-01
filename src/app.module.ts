import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { User } from './typeorm/entities/User';
import { Profile } from './typeorm/entities/Profile';

import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { School } from './typeorm/entities/School';
import { Photo } from './typeorm/entities/Photo';
import { Post } from './typeorm/entities/Post';
import { Rating } from './typeorm/entities/Rating';
import { PostModule } from './post/post.module';
import { Commentaire } from './typeorm/entities/Comment';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'yacine',
      password: 'yacine',
      database: 'university_guide',
      entities: [User, Profile, School, Photo, Post, , Rating, Commentaire],
      synchronize: true,
    }),
    AuthModule,
    ProfileModule,
    ConfigModule.forRoot({ envFilePath: './.env' }),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(private dataSource: DataSource) {}
  //
}
