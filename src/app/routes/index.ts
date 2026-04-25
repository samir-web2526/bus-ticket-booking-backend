import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { BusRoutes } from "../modules/Bus/bus.route";
import { BookingRoutes } from "../modules/Booking/booking.route";
import { RouteRoutes } from "../modules/Route/route.route";
import { ScheduleRoutes } from "../modules/Schedule/schedule.route";
import { SeatRoutes } from "../modules/Seat/seat.route";
import { SeatLockRoutes } from "../modules/SeatLock/seatLock.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/buses",
    route: BusRoutes,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
  {
    path: "/routes",
    route: RouteRoutes,
  },
  {
    path: "/schedules",
    route: ScheduleRoutes,
  },
  {
    path: "/seats",
    route: SeatRoutes,
  },
  {
    path: "/seat-locks",
    route: SeatLockRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const IndexRoutes = router;
