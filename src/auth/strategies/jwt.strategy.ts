import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MYSECRETKEY',
      secretexpiresIn: '7d',
    });
  }
  async validate(payload: any) {
    const user = await this.authService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException('No user found with this token.');
    }

    return { id: payload.id, username: payload.username };
  }
}
