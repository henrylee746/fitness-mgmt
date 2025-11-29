"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateSessionRoom } from "@/lib/actions";
import { SessionExtended } from "@/lib/types";
import { useActionState, useEffect, useState } from "react";

export const sessionColumns: ColumnDef<SessionExtended>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const session = row.original;
      const [showNotification, setShowNotification] = useState(false);

      type State = {
        success: string | undefined;
        error: string | undefined;
      };
      const [state, formAction, isPending] = useActionState(
        updateSessionRoom,
        {} as State
      );
      useEffect(() => {
        if (state.success || state.error) {
          setShowNotification(true);
          const timer = setTimeout(() => {
            setShowNotification(false);
          }, 5000);
          return () => clearTimeout(timer);
          //Resets the timer when the state changes
          //Component unmounts and has to re-render
        }
      }, [state.success, state.error]);
      return (
        /*onOpenChange is used to reset the notification when the dialog is closed*/
        <Dialog onOpenChange={() => setShowNotification(false)}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem>Edit Room</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
            </DialogHeader>
            <DialogDescription>Choose your new room here.</DialogDescription>
            {showNotification && state.success && (
              <p className="text-green-800 bg-green-50 p-4 rounded-md">
                {state.success}
              </p>
            )}
            {showNotification && state.error && (
              <p className="text-red-500 bg-destructive/10 p-4 rounded-md">
                {state.error}
              </p>
            )}
            <form action={formAction}>
              {/* Hidden inputs so we have a reference of session ID*/}
              <input type="hidden" name="sessionId" value={session.id} />

              <RadioGroup name="roomId" defaultValue="1">
                <div className="flex items-center gap-3 mt-4">
                  <RadioGroupItem value="1" id="1" />
                  <Label htmlFor="1">Studio A (Capacity: 20)</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="2" id="2" />
                  <Label htmlFor="2">Studio B (Capacity: 15)</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="3" id="3" />
                  <Label htmlFor="3">Cycling Room (Capacity: 12)</Label>
                </div>
              </RadioGroup>

              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "room.name",
    header: "Room",
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
