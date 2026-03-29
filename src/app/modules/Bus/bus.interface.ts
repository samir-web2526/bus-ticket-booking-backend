import { BusType } from "../../../generated/enums";

export interface TBus {
  operatorId?: string;
  name: string;
  number: string;
  type: BusType;
  totalSeats: number;
  vipSeats?: number;
  deluxeSeats?: number;
  vipPrice?: number;
  deluxePrice?: number;
  pricePerSeat: number;
  isActive?: boolean;
}
