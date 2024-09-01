import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Repository } from 'typeorm';
import { CreatePostParams } from './types/CreatePost.params';
import { Commentaire } from 'src/typeorm/entities/Comment';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Commentaire)
    private commentRepository: Repository<Commentaire>,
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
  async getUserPaginatedPosts(page: number, limit: number, userId: number) {
    return this.postRepository.find({
      where: { user: { id: 4 } },
      take: limit,
      skip: (page - 1) * limit,
      relations: { user: {} },
    });
  }
  async deletePost(id: number, userId: number) {
    let post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (post.user.id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.remove(post);
  }
  async getPostById(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: { user: { profile: {} }, comments: {} },
    });
  }
}
