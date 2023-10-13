import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import Jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
// Silf Classes
import { Roles } from './roles.decorator';
@Injectable()
export class UsersGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get(Roles, context.getHandler());
    // console.log('roles', roles);

    if (!roles) {
      return true;
    }
    // Get Token
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ', 2)[1];
    // Verify Token
    // const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(payload);
return true
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
