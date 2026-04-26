import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { envVars } from "../../../config/env";
import { jwtUtils } from "../../utils/jwt";

import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { UserRole, UserStatus } from "../../../generated/enums";
import { ILoginPayload, IRegisterPayload } from "./auth.interface";

const register = async (payload: IRegisterPayload) => {
  const { email, password, ...otherData } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new AppError(status.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name: otherData.name,
        phone: otherData.phone ?? null,
        profileImage: otherData.profileImage ?? null,
        role: UserRole.PASSENGER,
        status: UserStatus.ACTIVE,
      },
    });

    const passengerProfile = await tx.passengerProfile.create({
      data: {
        userId: user.id,
        gender: otherData.gender ?? null,
        dateOfBirth: otherData.dateOfBirth
          ? new Date(otherData.dateOfBirth)
          : null,
        emergencyContact: otherData.emergencyContact ?? null,
      },
    });

    return { user, passengerProfile };
  });

  const { password: _, ...userWithoutPassword } = result.user;
  return {
    user: userWithoutPassword,
    passengerProfile: result.passengerProfile,
  };
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email, isDeleted: false },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(status.FORBIDDEN, "Invalid password");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN },
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN },
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const verifyResponse = jwtUtils.verifyToken(
    token,
    envVars.REFRESH_TOKEN_SECRET,
  );

  if (!verifyResponse.success) {
    throw new AppError(status.FORBIDDEN, "Invalid refresh token");
  }

  const { id } = verifyResponse.data!;

  const user = await prisma.user.findUnique({
    where: { id, isDeleted: false },
  });

  if (!user || user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User not authorized");
  }

  const jwtPayload = { id: user.id, name: user.name, email: user.email, role: user.role };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN },
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  register,
  login,
  refreshToken,
};
