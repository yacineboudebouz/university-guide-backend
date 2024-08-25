import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dtos/updateptofile.dto';
import { ProfileService } from './profile.service';

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
}
