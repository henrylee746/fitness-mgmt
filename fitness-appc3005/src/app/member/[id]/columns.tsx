"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

/*For the Dashboard cardboard, no column definition needed 
as it only uses a Separator*/
export type Health = {
  id: string;
  date: string;
  weight: number;
  goal: number;
  classes: number;
  sessions: string[];
};

export type Session = {
  id: string;
  date: string;
  title: string;
  capacity: number;
  trainer: string;
  room: string;
};

export const sessionColumns: ColumnDef<Session>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  {
    accessorKey: "room",
    header: "Room",
  },
];
