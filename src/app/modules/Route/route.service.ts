import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { TRoute } from "./route.interface";
import { paginationHelper } from "../../sharedfile";
import { routeSearchableFields } from "./route.constant";


const createRoute = async (payload: TRoute) => {
  const { sourceCity, destinationCity, distanceKm, estimatedTimeMinutes, stops } = payload;
  const result = await prisma.route.create({
    data: {
      sourceCity,
      destinationCity,
      distanceKm,
      estimatedTimeMinutes,
      stops
    },
  });
  return result;
};

// const getAllRoutes = async (query: any) => {
//   const { search } = query;
//   const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

//   const andConditions: any[] = [];

//   if (search) {
//     andConditions.push({
//       OR: routeSearchableFields.map((field) => ({
//         [field]: {
//           contains: search,
//           mode: 'insensitive',
//         },
//       })),
//     });
//   }

//   const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.route.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy: { [sortBy]: sortOrder },
//     include: {
//       schedules: {
//         select: {
//           id: true,
//           departure: true,
//           arrival: true,
//           status: true,
//           bus: {
//             select: {
//               id: true,
//               name: true,
//               type: true,
//               totalSeats: true,
//               operator: {
//                 select: {
//                   id: true,
//                   name: true,
//                   email: true,
//                   phone: true,
//                   profileImage: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     }
//   });
//   const total = await prisma.route.count({ where: whereConditions });
//   return {
//     data: result,
//     meta: { page, limit, total }
//   }
// };

// const getRouteById = async (id: string) => {
//   const result = await prisma.route.findUnique({
//     where: { id },
//     include: {
//       schedules: {
//         select: {
//           id: true,
//           departure: true,
//           arrival: true,
//           status: true,
//           bus: {
//             select: {
//               id: true,
//               name: true,
//               type: true,
//               totalSeats: true,
//               operator: {
//                 select: {
//                   id: true,
//                   name: true,
//                   email: true,
//                   phone: true,
//                   profileImage: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     }
//   });
//   if (!result) {
//     throw new AppError(status.NOT_FOUND, 'Route not found');
//   };
//   return result;
// };

// const getAllRoutes = async (query: any) => {
//   const { search } = query;
//   const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

//   const andConditions: any[] = [];

//   if (search) {
//     andConditions.push({
//       OR: routeSearchableFields.map((field) => ({
//         [field]: {
//           contains: search,
//           mode: 'insensitive',
//         },
//       })),
//     });
//   }

//   andConditions.push({
//     schedules: {
//       some: {
//         departure: {
//           gte: new Date(),
//         },
//       },
//     },
//   });

//   const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
//   console.log("Current server time:", new Date().toISOString());
//   console.log("Where conditions:", JSON.stringify(whereConditions, null, 2));

//   const result = await prisma.route.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy: { [sortBy]: sortOrder },
//     include: {
//       schedules: {
//         where: {
//           departure: {
//             gte: new Date(),
//           },
//         },
//         select: {
//           id: true,
//           departure: true,
//           arrival: true,
//           status: true,
//           bus: {
//             select: {
//               id: true,
//               name: true,
//               type: true,
//               totalSeats: true,
//               operator: {
//                 select: {
//                   id: true,
//                   name: true,
//                   email: true,
//                   phone: true,
//                   profileImage: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   const total = await prisma.route.count({ where: whereConditions });

//   return {
//     data: result,
//     meta: { page, limit, total },
//   };
// };

const getAllRoutes = async (query: any) => {
  const { search } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

  const andConditions: any[] = [];

  if (search) {
    andConditions.push({
      OR: routeSearchableFields.map((field) => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }

  andConditions.push({
    schedules: {
      some: {
        departure: {
          gte: new Date(),
        },
      },
    },
  });

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

  console.log("Current server time:", new Date().toISOString());
  console.log("Where conditions:", JSON.stringify(whereConditions, null, 2));

  const result = await prisma.route.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      schedules: {
        where: {
          departure: {
            gte: new Date(),
          },
        },
        select: {
          id: true,
          departure: true,
          arrival: true,
          status: true,
          bus: {
            select: {
              id: true,
              name: true,
              type: true,
              totalSeats: true,
              operator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const total = await prisma.route.count({ where: whereConditions });

  return {
    data: result,
    meta: { page, limit, total },
  };
};

const getAllRoutesForDropdown = async () => {
  return await prisma.route.findMany({
    select: {
      id: true,
      sourceCity: true,
      destinationCity: true,
      distanceKm: true,
      estimatedTimeMinutes: true,
    },
    orderBy: { sourceCity: 'asc' },
  });
};

const getRouteById = async (id: string) => {
  const result = await prisma.route.findUnique({
    where: { id },
    include: {
      schedules: {
        where: {
          departure: {
            gte: new Date(),
          },
        },
        include: {
          bus: {
            include: {
              operator: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Route not found');
  }

  return result;
};
const updateRoute = async (id: string, payload: any) => {
  const isRouteExist = await prisma.route.findUnique({
    where: { id },
  });
  if (!isRouteExist) {
    throw new AppError(status.NOT_FOUND, 'Route not found');
  };
  return await prisma.route.update({
    where: { id },
    data: payload,
  });
};

const deleteRoute = async (id: string) => {
  const isRouteExist = await prisma.route.findUnique({
    where: { id },
  });
  if (!isRouteExist) {
    throw new AppError(status.NOT_FOUND, 'Route not found');
  };
  return await prisma.route.delete({
    where: { id },
  });
};

export const RouteService = {
  createRoute,
  getAllRoutes,
  getAllRoutesForDropdown,
  getRouteById,
  updateRoute,
  deleteRoute,
};
