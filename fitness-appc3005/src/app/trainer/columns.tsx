"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Health = {
  id: string;
  date: string;
  weight: number;
  goal: number;
  classes: number;
  sessions: string[];
};

//Session type with room and trainer relations joined together
export type Session = {
  capacity: number;
  dateTime: Date;
  id: number;
  name: string;
  room: object;
  roomId: number;
  trainer: object;
  trainerId: number;
};

export type Trainer = {
  id: number;
  email: string;
  name: string;
};

interface WithTrainer {
  trainer: { name: string };
}

export const sessionColumns: ColumnDef<WithTrainer, Session>[] = [
  {
    accessorKey: "name",
    header: "Session",
  },
  {
    accessorKey: "capacity",
    header: "Space",
  },
  {
    accessorKey: "trainer.name",
    header: "Trainer",
  },
  {
    accessorKey: "room.name",
    header: "Room",
  },
  {
    accessorKey: "dateTime",
    header: "Date",
  },
];
