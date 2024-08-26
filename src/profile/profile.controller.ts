import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dtos/updateptofile.dto';
import { ProfileService } from './profile.service';
import { AdminGuard } from 'src/auth/guards/role.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @HttpCode(201)
  @Patch('')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: any,
    @Body() updateProdile: UpdateProfileDto,
  ) {
    return this.profileService.UpdateProfile(updateProdile, req.user.id);
  }

  @HttpCode(200)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user.id);
  }
}
