import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Repository } from 'typeorm';
import { CreatePostParams } from './types/CreatePost.params';
import { Commentaire } from 'src/typeorm/entities/Comment';
import { User } from 'src/typeorm/entities/User';
import { AddCommentDto } from './dtos/AddComment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Commentaire)
    private commentRepository: Repository<Commentaire>,
    @InjectRepository(User) private userRepository: Repository<User>,
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
    let posts = await this.postRepository.find({
      where: { user: { id: 4 } },
      take: limit,
      skip: (page - 1) * limit,
      relations: { user: {}, likedBy: {} },
    });
    posts = posts.map((post) => {
      const likeCount = post.likedBy.length;
      return { ...post, likeCount };
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
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { user: { profile: {} }, comments: { user: {} }, likedBy: {} },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const likeCount = post.likedBy.length;
    return { ...post, likeCount };
  }

  async likePost(postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likedBy'],
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (post.likedBy.some((u) => u.id === userId)) {
      post.likedBy = post.likedBy.filter((u) => u.id !== userId);
    } else {
      post.likedBy.push(user);
    }
    await this.postRepository.save(post);
  }

  async addComment(postId: number, comment: AddCommentDto, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comments'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newComment = this.commentRepository.create({
      ...comment,
      user,
      post,
    });
    post.comments.push(newComment);
    await this.commentRepository.save(newComment);
  }
  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    if (comment.user.id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    await this.commentRepository.remove(comment);
  }
}
