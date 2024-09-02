import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../auth.service';
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const user = await this.authService.findUserById(request.user.id);

    const isAdmin = user.isAdmin;

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not allowed to access this resource , Only Admins',
      );
    }

    return true;
  }
}
