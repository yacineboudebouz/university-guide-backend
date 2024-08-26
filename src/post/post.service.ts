import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Rating } from 'src/typeorm/entities/Rating';
import { Repository } from 'typeorm';
import { CreatePostParams } from './types/CreatePost.params';
import { NEVER } from 'rxjs';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  // get paginated posts
  async getPosts(page: number, limit: number) {
    return this.postRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user'],
    });
  }
  // get all posts and their users except the profile
  async getAllPosts() {
    return this.postRepository.find({
      relations: ['user'],
    });
  }

  // explain the createNewPost method
  async createNewPost(createPostParams: CreatePostParams, userId: number) {
    const post = this.postRepository.create({
      ...createPostParams,
      user: { id: userId },
    });

    return this.postRepository.save(post);
  }

  async getUserPosts(userId: number) {
    return this.postRepository.find({
      where: { user: { id: userId } },
    });
  }
}
