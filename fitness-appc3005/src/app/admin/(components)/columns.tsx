"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Loader, MoreHorizontal } from "lucide-react";
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
import { ClassSessionExtended, Room } from "@/lib/types";
import { updateSessionRoom } from "@/lib/actions";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { getRooms } from "@/lib/actions";

const formSchema = z.object({
  sessionId: z.string().min(1, { message: "Session is required" }),
  roomId: z.string().min(1, { message: "Room is required" }),
});

type FormData = z.infer<typeof formSchema>;


export const sessionColumns: ColumnDef<ClassSessionExtended>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const [rooms, setRooms] = useState<Room[]>([]);

      useEffect(() => {
        const getSessionRooms = async () => {
          const sessionRooms = await getRooms();
          setRooms(sessionRooms);
        };
        getSessionRooms();
      }, []);

      const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          sessionId: row.original.id.toString(),
          roomId: "",
        },
      });

      const onSubmit = async (data: FormData) => {
        form.clearErrors();
        try {
          const formData = new FormData();
          formData.append("sessionId", data.sessionId);
          formData.append("roomId", data.roomId);
          const result = await updateSessionRoom(formData);
          if (!result.success && result.error) {
            form.setError("root.serverError", { message: result.error });
            toast.error(result.error);
            return;
          }
          toast.success("Session room updated successfully");
          form.reset();
        } catch (error: unknown) {
          form.setError("root.serverError", { message: "Failed to update session room" });
          toast.error("Failed to update session room");
        }
      };

      return (
        <Dialog>
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
            {form.formState.errors.roomId && (
              <p className="text-xs text-red-500">{form.formState.errors.roomId.message}</p>
            )}
            {form.formState.errors.sessionId && (
              <p className="text-xs text-red-500">{form.formState.errors.sessionId.message}</p>
            )}
            {form.formState.errors.root?.serverError && (
              <p className="text-xs text-red-500">{form.formState.errors.root.serverError.message}</p>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              {rooms.length > 0 && (<Controller
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value} name="roomId" defaultValue="7" required={true}>
                    <div className="flex items-center gap-3 mt-4">
                      <RadioGroupItem value={rooms[0].id.toString()} id={rooms[0].id.toString()} />
                      <Label htmlFor={rooms[0].id.toString()}>{rooms[0].name} (Capacity: {rooms[0].capacity})</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={rooms[1].id.toString()} id={rooms[1].id.toString()} />
                      <Label htmlFor={rooms[1].id.toString()}>{rooms[1].name} (Capacity: {rooms[1].capacity})</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={rooms[2].id.toString()} id={rooms[2].id.toString()} />
                      <Label htmlFor={rooms[2].id.toString()}>{rooms[2].name} (Capacity: {rooms[2].capacity})</Label>
                    </div>
                  </RadioGroup>
                )}
              />)}
              <DialogFooter>
                <Button className="mt-4" type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader /> : null}
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
    header: "Spots",
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
