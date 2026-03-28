import { BusType } from '../../../generated/enums';

export type TBus = {
  operatorId: string;
  name: string;
  number: string;
  type: BusType;
  totalSeats: number;
  pricePerSeat: number;
  isActive?: boolean;
};

