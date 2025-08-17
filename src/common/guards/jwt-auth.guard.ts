import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isTokenRevoked } from '../utils/token-blacklist';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      if (isTokenRevoked(token)) {
        throw new UnauthorizedException('Token revocado. Inicie sesión nuevamente.');
      }
    }
    return super.canActivate(context);
  }
}
