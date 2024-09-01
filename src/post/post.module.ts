import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Rating } from 'src/typeorm/entities/Rating';
import { Commentaire } from 'src/typeorm/entities/Comment';

@Module({
  controllers: [PostController],
  providers: [PostService, JwtService],
  imports: [TypeOrmModule.forFeature([Post, Rating, Commentaire])],
})
export class PostModule {}
