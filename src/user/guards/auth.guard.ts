import AuthRequest from '@/types/expressRequest.interface';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';


export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    if (request.user.id) {
      return true;
    }

    throw new HttpException('Not Authorized ', HttpStatus.UNAUTHORIZED);
  }
}
