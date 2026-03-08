export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null | undefined;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Member = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
};

//Used for displaying member information in the member dashboard
export type MemberInfo = {
  weight: number;
  weightGoal: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type MemberWithBookingsAndMetrics = Member & {
  bookings: Booking[];
  metrics: HealthMetric[];
};

export type HealthMetric = {
  weightGoal: number;
  weight: number;
  memberId: number;
  id: number;
  timestamp: Date;
};

export type Booking = {
  classSessionId: number;
  memberId: number;
  classSession: ClassSession;
  id: number;
  createdAt: Date;
};

export type Trainer = {
  id: number;
  email: string;
  name: string;
};

//Slimmed down trainer type for use in GroupClass.tsx and ClassManagement.tsx
export type TrainerSlim = Omit<Trainer, "email">;

export type Room = {
  capacity: number;
  id: number;
  name: string;
};

export type ClassSessionWithRoomAndTrainer = ClassSession & {
  room: Room;
  trainer: Trainer;
};

export type ClassSession = {
  capacity: number;
  dateTime: Date;
  id: number;
  name: string;
  roomId: number;
  trainerId: number;
};
