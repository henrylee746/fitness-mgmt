"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Calendar24 } from "@/components/calendar-24";
import { createSession } from "@/lib/actions";
import { Trainer } from "@/lib/types";
import { useActionState, useState, useEffect } from "react";

export default function ClassManagement({ trainers }: { trainers: Trainer[] }) {
  type State = {
    success: string | undefined;
    error: any;
    /*any is used to allow for any type of error,
    including SQL-level exceptions*/
  };
  const [state, formAction, isPending] = useActionState(
    createSession,
    {} as State
  );
  const [showNotification, setShowNotification] = useState(false);

  // Show notification when state changes, then hide after 5 seconds
  useEffect(() => {
    if (state.success || state.error) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      // Cleanup timeout on unmount or when state changes
      return () => clearTimeout(timer);
    }
  }, [state.success, state.error]);

  return (
    <Card className="w-full xl:max-w-xl lg:max-w-md md:max-w-sm max-w-xs">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Class Management
          <IconCirclePlusFilled />
        </CardTitle>
        <CardDescription>
          Create new sessions here (all fields required).
        </CardDescription>
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
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center  gap-2">
          <form className="w-full" action={formAction}>
            <div className="flex flex-col gap-4 justify-stretch">
              <CardDescription>Basic Details</CardDescription>
              <Input
                id="session"
                type="text"
                placeholder="Session Name"
                name="sessionName"
                required={true}
              />
              <Input
                id="capacity"
                type="number"
                placeholder="Capacity"
                name="capacity"
                required={true}
              />{" "}
              <Select name="trainer">
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
              </Select>{" "}
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <Calendar24 />
              <CardDescription>Room</CardDescription>
              <RadioGroup name="roomId" defaultValue="1" required={true}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="1" id="1" />
                  {/*If adding room editing, hardcoding capacities 
                  should be removed*/}
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

              <Button type="submit" variant="secondary" disabled={isPending}>
                Create
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
