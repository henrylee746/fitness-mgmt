"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ClassSessionExtended } from "@/lib/types";

//Session type with room and trainer relations joined together

interface WithTrainer {
  trainer: { name: string };
}

export const sessionColumns: ColumnDef<WithTrainer, ClassSessionExtended>[] = [
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
    cell: ({ row }) => {
      const value = row.getValue<Date>("dateTime");

      const date = new Date(value);
      const formatted =
        date.toLocaleDateString("en-CA") +
        " " +
        date.toLocaleTimeString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
        });

      return formatted;
    },
  },
];
