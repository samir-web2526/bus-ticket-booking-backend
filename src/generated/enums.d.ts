export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly OPERATOR: "OPERATOR";
    readonly PASSENGER: "PASSENGER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly BLOCKED: "BLOCKED";
    readonly DELETED: "DELETED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const BusType: {
    readonly AC: "AC";
    readonly NON_AC: "NON_AC";
    readonly SLEEPER: "SLEEPER";
    readonly DOUBLE_DECKER: "DOUBLE_DECKER";
};
export type BusType = (typeof BusType)[keyof typeof BusType];
export declare const BookingStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly EXPIRED: "EXPIRED";
    readonly CANCELLED: "CANCELLED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const SeatType: {
    readonly STANDARD: "STANDARD";
    readonly DELUXE: "DELUXE";
    readonly VIP: "VIP";
};
export type SeatType = (typeof SeatType)[keyof typeof SeatType];
//# sourceMappingURL=enums.d.ts.map