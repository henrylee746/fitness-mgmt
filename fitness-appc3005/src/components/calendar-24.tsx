"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Calendar24() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <>
      {/* Hidden input for form submission 
      (date picker doesn't have a name property to access its value)*/}
      <input
        type="hidden"
        name="date"
        value={date ? date.toISOString().split("T")[0] : ""}
      />

      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date-picker" className="px-1">
            Date
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(value) => {
                  setDate(value);
                  setOpen(false);
                }}
                required={true}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="time-picker" className="px-1">
            Time
          </Label>
          <Input
            type="time"
            id="time-picker"
            name="time"
            step="1"
            required={true}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </div>
      </div>
    </>
  );
}
