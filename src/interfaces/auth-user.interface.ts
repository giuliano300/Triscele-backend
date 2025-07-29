import { UserRole } from '../roles/roles.decorator';

export interface AuthUser {
  _id: string;
  email: string;
  password: string;
  role: UserRole;
}
