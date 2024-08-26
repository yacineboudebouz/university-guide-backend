import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Transform } from 'class-transformer';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createPost(@Body() post: CreatePostDto, @Req() req: any) {
    return this.postService.createNewPost(post, req.user.id);
  }
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllPosts() {
    return this.postService.getAllPosts();
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyPosts(@Req() req: any) {
    return this.postService.getUserPosts(req.user.id);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postService.getPosts(page, limit);
  }
}
