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
import { Trainer } from "../trainer/columns";
import { Calendar24 } from "@/components/calendar-24";
import { createSession } from "@/lib/actions";

export default function ClassManagement({ trainers }: { trainers: Trainer[] }) {
  return (
    <Card className="w-full xl:max-w-xl lg:max-w-lg md:max-w-md sm:max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Class Management
          <IconCirclePlusFilled />
        </CardTitle>
        <CardDescription>Create new sessions here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center  gap-2">
          <form className="w-full" action={createSession}>
            <div className="flex flex-col gap-4 justify-stretch">
              <CardDescription>Basic Details</CardDescription>
              <Input
                id="session"
                type="text"
                placeholder="Session Name"
                name="sessionName"
              />
              <Input
                id="capacity"
                type="number"
                placeholder="Capacity"
                name="capacity"
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
              <RadioGroup name="roomId" defaultValue="1">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="1" id="1" />
                  <Label htmlFor="1">Studio A</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="2" id="2" />
                  <Label htmlFor="2">Studio B</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="3" id="3" />
                  <Label htmlFor="3">Cycling Room</Label>
                </div>
              </RadioGroup>

              <Button type="submit" variant="secondary">
                Create
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
