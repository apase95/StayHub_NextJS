export const Role = {
  GUEST: "GUEST",
  HOST: "HOST",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export type UserRole = Role;

export const BookingStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PropertyType = {
  APARTMENT: "APARTMENT",
  HOUSE: "HOUSE",
  VILLA: "VILLA",
  HOTEL_ROOM: "HOTEL_ROOM",
  HOMESTAY: "HOMESTAY",
  RESORT: "RESORT",
} as const;
export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];

export const AmenityType = {
  WIFI: "WiFi",
  AIR_CONDITIONING: "Air Conditioning",
  KITCHEN: "Kitchen",
  POOL: "Pool",
  PARKING: "Parking",
  WASHER: "Washer",
  TV: "TV",
  WORKSPACE: "Workspace",
} as const;
export type AmenityType = (typeof AmenityType)[keyof typeof AmenityType];
