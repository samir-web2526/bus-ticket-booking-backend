export type TSchedule = {
  busId: string;
  routeId: string;
  departure: string;
  arrival: string;
  fare: number;
  status?: string;
};
