import { BookingStatus } from '../../../generated/enums';

export const bookingFilterableFields = ['status'];
export const bookingStatuses = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CANCELLED,
  BookingStatus.EXPIRED,
];
