"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClassManagementCalendar } from "@/components/ClassManagementCalendar";
import { createSession } from "@/lib/actions";
import { Room, Trainer } from "@/lib/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getRooms } from "@/lib/actions";

const formSchema = z.object({
  sessionName: z.string().min(1, { message: "Session name is required" }),
  capacity: z.number().min(1, { message: "Capacity is required" }).max(20, { message: "Our largest room capacity is 20. Please enter a capacity of 20 or less." }),
  trainer: z.string().min(1, { message: "Trainer is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  //YYYY-MM-DD format e.g. "2026-02-10"
  time: z.string().min(1, { message: "Time is required" }),
  //8 characters is the format of the time e.g. "10:30:00"
  roomId: z.string().min(1, { message: "Room is required" }),
});

type FormData = z.infer<typeof formSchema>;

export default function ClassManagement({ trainers }: { trainers: Trainer[] }) {

  const [rooms, setRooms] = useState<Room[]>([]);
  const [calendarKey, setCalendarKey] = useState(0);

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
      sessionName: "",
      capacity: 0,
      trainer: "",
      date: "",
      time: "",
      roomId: "",
    },
    mode: "onBlur",
  });


  const onSubmit = async (data: FormData) => {
    form.clearErrors();

    const formData = new FormData();
    formData.append("sessionName", data.sessionName);
    formData.append("capacity", data.capacity.toString());
    formData.append("trainer", data.trainer);
    formData.append("date", data.date);
    formData.append("time", data.time);
    formData.append("roomId", data.roomId);

    try {
      const result = await createSession(formData);
      if (!result.success && result.error) {
        form.setError("root.serverError", { message: result.error });
        toast.error(result.error);
        return;
      }
      toast.success("Session created successfully");
      form.reset();
      setCalendarKey(prev => prev + 1);
    } catch (error: unknown) {
      form.setError("root.serverError", { message: "Failed to create session" });
      toast.error("Failed to create session");
    }
  };

  return (
    <Card className="w-full xl:max-w-xl sm:max-w-md max-w-xs">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Class Management
          <IconCirclePlusFilled />
        </CardTitle>
        {form.formState.errors.root?.serverError && (
          <p className="text-xs text-red-500">{form.formState.errors.root.serverError.message}</p>
        )}
        <CardDescription>
          Create new sessions here (all fields required).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center  gap-2">
          <form className="w-full" noValidate onSubmit={form.handleSubmit(onSubmit)} >
            <div className="flex flex-col gap-4 justify-stretch">
              <CardDescription>Basic Details</CardDescription>
              <Input
                {...form.register("sessionName")}
                id="sessionName"
                type="text"
                placeholder="Session Name"
                name="sessionName"
                required={true}
              />
              {form.formState.errors.sessionName && (
                <p className="text-xs text-red-500">{form.formState.errors.sessionName.message}</p>
              )}
              <Input
                {...form.register("capacity", { valueAsNumber: true })}
                id="capacity"
                type="number"
                placeholder="Capacity"
                name="capacity"
                required={true}
              />
              {form.formState.errors.capacity && (
                <p className="text-xs text-red-500">{form.formState.errors.capacity.message}</p>
              )}

              <Controller
                control={form.control}
                name="trainer"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} name="trainer">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Trainers</SelectLabel>
                        {trainers.map((trainer) => (
                          <SelectItem key={trainer.id} value={String(trainer.id)}>
                            {trainer.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.trainer && (
                <p className="text-xs text-red-500">{form.formState.errors.trainer.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <ClassManagementCalendar key={calendarKey} onDateChange={(date) => form.setValue("date", date, { shouldValidate: true })} onTimeChange={(time) => form.setValue("time", time, { shouldValidate: true })} />
              {form.formState.errors.date && (
                <p className="text-xs text-red-500">{form.formState.errors.date.message}</p>
              )}
              {form.formState.errors.time && (
                <p className="text-xs text-red-500">{form.formState.errors.time.message}</p>
              )}
              <CardDescription>Room</CardDescription>
              {rooms.length > 0 && (
                <Controller
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} value={field.value} name="roomId" defaultValue="7" required={true}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={rooms[0].id.toString()} id={rooms[0].id.toString()} />
                        {/*If adding room editing, hardcoding capacities 
                  should be removed*/}
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
                />
              )}
              {form.formState.errors.roomId && (
                <p className="text-xs text-red-500">{form.formState.errors.roomId.message}</p>
              )}
              <Button type="submit" variant="secondary" disabled={form.formState.isSubmitting}>
                Create
                {form.formState.isSubmitting ? <Loader /> : null}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
