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

