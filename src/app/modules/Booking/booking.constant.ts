import { BookingStatus } from '../../../generated/enums';

export const bookingSearchableFields = ['id', 'status'];
export const bookingStatuses = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CANCELLED,
  BookingStatus.EXPIRED,
];
