import { prisma } from "../../../lib/prisma";

const createUser = async (payload: any) => {
  const result = await prisma.user.create({
    data: payload,
  });
  return result;
};

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

const getMe = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
      isDeleted: false,
    },
    include: {
      operatorProfile: true,
      passengerProfile: true,
    },
  });
  return result;
};

const updateMe = async (userId: string, payload: any) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
  });
  return result;
};

const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateUser = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteUser = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getMe,
  updateMe,
  getUserById,
  updateUser,
  deleteUser,
};
