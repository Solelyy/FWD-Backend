import { SetMetadata } from '@nestjs/common';

// 'roles' is the key of this metadata
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
