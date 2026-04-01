import { UserRole, UserStatus } from "../../../generated/enums";

export interface ICreateOperatorPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  companyName: string;
  tradeLicense: string;
  nid: string;
  address: string;
}



export interface IUpdateUserPayload {
  name?: string;
  phone?: string;
  profileImage?: string;
}

export interface IUpdateUserByAdminPayload {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  status?: UserStatus;
}
