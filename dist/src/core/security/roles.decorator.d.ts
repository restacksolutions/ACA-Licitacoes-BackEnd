import { RoleCompany } from '@prisma/client';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: RoleCompany[]) => import("@nestjs/common").CustomDecorator<string>;
