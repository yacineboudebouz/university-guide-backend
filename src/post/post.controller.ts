import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('post')
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
}
