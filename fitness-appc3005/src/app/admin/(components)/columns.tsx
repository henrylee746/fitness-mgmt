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
import { ClassSessionExtended } from "@/lib/types";
import { updateSessionRoom } from "@/lib/actions";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const formSchema = z.object({
  sessionId: z.string().min(1, { message: "Session is required" }),
  roomId: z.string().min(1, { message: "Room is required" }),
});

type FormData = z.infer<typeof formSchema>;


export const sessionColumns: ColumnDef<ClassSessionExtended>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          sessionId: row.original.id.toString(),
          roomId: "7",
        },
      });

      const onSubmit = async (data: FormData) => {
        form.clearErrors();
        try {
          const formData = new FormData();
          formData.append("sessionId", data.sessionId);
          formData.append("roomId", data.roomId);
          await updateSessionRoom(formData);
          toast.success("Session room updated successfully");
          form.reset();
        } catch (error: unknown) {
          if (error instanceof Error) {
            form.setError("root.serverError", { message: error.message });
            toast.error(error.message);
          } else {
            form.setError("root.serverError", { message: "Failed to update session room" });
            toast.error("Failed to update session room");
          }
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Controller
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value} name="roomId" defaultValue="7" required={true}>
                    <div className="flex items-center gap-3 mt-4">
                      <RadioGroupItem value="7" id="7" />
                      <Label htmlFor="7">Studio A (Capacity: 20)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="8" id="8" />
                      <Label htmlFor="8">Studio B (Capacity: 15)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="9" id="9" />
                      <Label htmlFor="9">Cycling Room (Capacity: 12)</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
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
