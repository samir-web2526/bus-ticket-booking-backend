import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { ICreateOperatorPayload, IUpdateUserByAdminPayload, IUpdateUserPayload } from "./user.interface";
import { UserRole, UserStatus } from "../../../generated/enums";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { paginationHelper } from "../../sharedfile";
import { userSearchableFields, userSelectFields } from "./user.constant";


const createUser = async (payload: ICreateOperatorPayload) => {
  const { name, email, password, ...otherData } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: otherData.phone ?? null,
        profileImage: otherData.profileImage ?? null,
        role: UserRole.OPERATOR,
        status: UserStatus.ACTIVE,
      },
    });

    const operatorProfile = await tx.operatorProfile.create({
      data: {
        userId: user.id,
        companyName: otherData.companyName,
        tradeLicense: otherData.tradeLicense,
        nid: otherData.nid,
        address: otherData.address,
      },
    });

    return { user, operatorProfile };
  });

  const { password: _, ...userWithoutPassword } = result.user;
  return {
    user: userWithoutPassword,
    operatorProfile: result.operatorProfile,
  };
};

const getAllUsers = async (query: any) => {
  const { search, role, status } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

  const andConditions: any[] = [];

  if (search) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (role) {
    andConditions.push({ role });
  }
  if (status) {
    andConditions.push({ status });
  }

  andConditions.push({ isDeleted: false });

  const whereConditions = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },

  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMe = async (userId: string, role: UserRole) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
      isDeleted: false,
    },
    select: {
      ...userSelectFields,
      operatorProfile: role === UserRole.OPERATOR,
      passengerProfile: role === UserRole.PASSENGER,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  return result;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id, isDeleted: false },
    select: userSelectFields,
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  return prisma.user.findUnique({
    where: { id },
    select: {
      ...userSelectFields,
      operatorProfile: user.role === UserRole.OPERATOR,
      passengerProfile: user.role === UserRole.PASSENGER,
    },
  });
};

const updateUser = async (id: string, payload: IUpdateUserByAdminPayload) => {
  const { name, email, phone, profileImage, status: userStatus } = payload;
  const user = await prisma.user.findUnique({
    where: { id, isDeleted: false },
    select: userSelectFields,
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  };

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: name,
      email: email,
      phone: phone,
      profileImage: profileImage,
      status: userStatus,
    },
    select: {
      ...userSelectFields,
      operatorProfile: user.role === UserRole.OPERATOR,
      passengerProfile: user.role === UserRole.PASSENGER,
    },

  });
  return result;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id, isDeleted: false },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  };
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
    select: {
      ...userSelectFields,
      operatorProfile: user.role === UserRole.OPERATOR,
      passengerProfile: user.role === UserRole.PASSENGER,
    },
  });
  return result;
};

const getOperatorPassengers = async (operatorId: string, query: any) => {
  const { search, status: passengerStatus } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

  const andConditions: any[] = [];

  andConditions.push({
    bookings: {
      some: {
        schedule: {
          bus: {
            operatorId: operatorId,
          }
        }
      }
    }
  });

  if (search) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (passengerStatus) {
    andConditions.push({ status: passengerStatus });
  }

  andConditions.push({ isDeleted: false });
  andConditions.push({ role: UserRole.PASSENGER });

  const whereConditions = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      ...userSelectFields,
      passengerProfile: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const UserService = {
  createUser,
  getAllUsers,
  getMe,
  getUserById,
  updateUser,
  deleteUser,
  getOperatorPassengers
};
