import { BookingStatus } from '../../../generated/enums';

export type TBooking = {
  userId: string;
  scheduleId: string;
  totalFare: number;
  status: BookingStatus;
};

