
import AuthRequest from '@/types/expressRequest.interface';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = new UserEntity();
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];


    try {
      const decode = await verify(token, process.env.JWT_SECRET);

      const user = await this.userService.userFindById(decode.id);

      req.user = user;

    } catch (error) {
      req.user = new UserEntity();
      console.log(error)
      return;
    }finally{
      next();
    }


  }
}
