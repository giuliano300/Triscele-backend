// src/auth/roles/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export type UserRole = 'admin' | 'gestore' | 'cliente';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
