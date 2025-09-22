import { SetMetadata } from '@nestjs/common';
import { RoleCompany } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleCompany[]) => SetMetadata(ROLES_KEY, roles);
