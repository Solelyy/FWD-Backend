import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // access the metadata or data thru reflector
    // reflector must know the key of the metadata
    const requiredRoles = this.reflector.get<string[]>(
      'roles', // key of metadata
      context.getHandler(),
    );
    // if no roles set, access the route
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.includes(user?.role); // dont proceed if role is not on the list
  }
}
