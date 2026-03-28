export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  gender?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}
