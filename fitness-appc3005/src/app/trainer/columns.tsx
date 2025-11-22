"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Session = {
  id: string;
  date: string;
  title: string;
  capacity: number;
  trainer: string;
};

export const sessionColumns: ColumnDef<Session>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "title",
    header: "Session",
  },
  {
    accessorKey: "capacity",
    header: "Space",
  },
  {
    accessorKey: "trainer",
    header: "Trainer",
  },
];
