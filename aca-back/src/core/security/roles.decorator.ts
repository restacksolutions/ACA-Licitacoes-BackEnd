import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: Array<'owner'|'admin'|'member'>) => SetMetadata('roles', roles);
