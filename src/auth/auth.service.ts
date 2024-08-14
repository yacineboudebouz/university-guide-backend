import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import { HashingHelper } from 'src/utils/hash';
import { Profile } from 'src/typeorm/entities/Profile';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    const hashedPassword = await HashingHelper.hashPassword(password);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    const profile = this.profileRepository.create();
    await this.profileRepository.save(profile);
    user.profile = profile;
    await this.userRepository.save(user);
    return user;
  }

  async validateUser(loginDto: LoginDto) {
    const { username, password } = loginDto;
    let user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      user = await this.userRepository.findOne({ where: { email: username } });
      if (!user) {
        return null;
      }
    }
    const hashedPassword = await HashingHelper.hashPassword(password);
    const passwordMatching = await HashingHelper.comparePassword(
      hashedPassword,
      user.password,
    );
    if (!passwordMatching) {
      return null;
    } else {
      const token = this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      return { access_token: token };
    }
  }
}
