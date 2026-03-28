import { UserRole, UserStatus } from '../../../generated/enums';

export type TUser = {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  profileImage?: string;
  role: UserRole;
  status: UserStatus;
};
