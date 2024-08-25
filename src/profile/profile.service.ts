import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dtos/updateptofile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async UpdateProfile(updateProfile: UpdateProfileDto, userId: number) {
    let user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const profileId = user.profile.id;
    user.profile = { id: profileId, ...updateProfile };

    await this.profileRepository.save(user.profile);
    return { message: 'Profile updated successfully' };
  }
  async getProfile(userId: number) {
    let user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) {
      throw new HttpException('Profile not found', 404);
    }
    return user.profile;
  }
}
