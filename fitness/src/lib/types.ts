export interface Room {
  capacity: number;
  id: number;
  name: string;
}

export interface ClassSessionExtended {
  capacity: number;
  dateTime: Date;
  id: number;
  name: string;
  room: Room;
  trainer: Trainer;
  roomId: number;
  trainerId: number;
}

export interface ClassSession {
  capacity: number;
  dateTime: Date;
  id: number;
  name: string;
  roomId: number;
  trainerId: number;
}

export interface Booking {
  classSessionId: number;
  memberId: number;
  classSession: ClassSession | ClassSessionExtended;
  id: number;
  createdAt: Date;
}

export interface Trainer {
  id: number;
  email: string;
  name: string;
}

export interface HealthMetric {
  weightGoal: number;
  weight: number;
  memberId: number;
  id: number;
  timestamp: Date;
}

export interface Member {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  registeredAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null | undefined;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInfo {
  weight: number;
  weightGoal: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface MemberExtended {
  bookings: Booking[] | [];
  metrics: HealthMetric[] | [];
}

export interface MemberExtendedMetrics {
  metrics: HealthMetric[] | [];
}

export interface MemberExtendedBookings {
  bookings: Booking[] | [];
}
