import { prisma } from "../../../lib/prisma";

const createRoute = async (payload: any) => {
  const result = await prisma.route.create({
    data: payload,
  });
  return result;
};

const getAllRoutes = async () => {
  const result = await prisma.route.findMany();
  return result;
};

const getRouteById = async (id: string) => {
  const result = await prisma.route.findUnique({
    where: { id },
  });
  return result;
};

const updateRoute = async (id: string, payload: any) => {
  const result = await prisma.route.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteRoute = async (id: string) => {
  const result = await prisma.route.delete({
    where: { id },
  });
  return result;
};

export const RouteService = {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};
