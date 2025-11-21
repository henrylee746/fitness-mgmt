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

export const columns: ColumnDef<Health>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "weight",
    header: "Curr. Weight (lbs)",
  },
  {
    accessorKey: "goal",
    header: "Weight Goal",
  },
  {
    accessorKey: "classes",
    header: "Past Classes",
  },
  {
    accessorKey: "sessions",
    header: "Upcoming Sessions",
  },
];
