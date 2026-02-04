"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

/*For the Dashboard cardboard, no column definition needed 
as it only uses a Separator*/
import { ClassSessionExtended } from "@/lib/types";

export const sessionColumns: ColumnDef<ClassSessionExtended>[] = [
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
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
