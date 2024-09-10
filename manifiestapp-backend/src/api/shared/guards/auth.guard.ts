import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // verify the token
    const request = context.switchToHttp().getRequest();
    const userToken = request.header('token');
    if (!userToken) {
      throw new HttpException({ message: ['You must be connected to use it'] }, HttpStatus.FORBIDDEN);
    }
    const jwt = require('jsonwebtoken');
    let user;
    try {
      user = jwt.verify(userToken, process.env.JWT_SECURITY_KEY);
    } catch (error) {
      throw new HttpException({ message: ['From where did you come from? You don\'t have the right token...'] }, HttpStatus.UNAUTHORIZED);
    }

    // verify the role(s)
    const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
    if (roles.find(x => x === RoleEnum.Connected)) {
      return true;
    }
    else if (roles.find(x => user.extra.roles.includes(x))) {
      return true;
    }

    throw new HttpException({ message: ['You don\'t have the right role to use it.'] }, HttpStatus.UNAUTHORIZED);
    return false;
  }
}