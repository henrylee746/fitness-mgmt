export type Room = {
  capacity: number;
  id: number;
  name: string;
};

export type ClassSessionExtended = {
  capacity: number;
  dateTime: Date;
  id: number;
  name: string;
  room: Room;
  trainer: Trainer;
  roomId: number;
  trainerId: number;
};

export type ClassSession = {
  capacity: number;
  dateTime: Date;
  id: number;
  name: string;
  roomId: number;
  trainerId: number;
};

export type Booking = {
  classSessionId: number;
  memberId: number;
  classSession: ClassSession | ClassSessionExtended;
  id: number;
  createdAt: Date;
};

export type Trainer = {
  id: number;
  email: string;
  name: string;
};

export type HealthMetric = {
  weightGoal: number;
  weight: number;
  memberId: number;
  id: number;
  timestamp: Date;
};

export type Member = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  registeredAt: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null | undefined;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MemberInfo = {
  weight: number;
  weightGoal: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type MemberExtended = Member & {
  bookings: Booking[] | [];
  metrics: HealthMetric[] | [];
};

export type MemberExtendedMetrics = Member & {
  metrics: HealthMetric[] | [];
};

export type MemberExtendedBookings = Member & {
  bookings: Booking[] | [];
};
