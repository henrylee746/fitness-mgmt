import {
  IconUserFilled,
  IconUser,
  IconUserCog,
  IconBarbell,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  /*Can use this to test loading.tsx page
  console.log("Fetching revenue data...");
  await new Promise((resolve) => setTimeout(resolve, 30000));
  */
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="max-w-2xl flex flex-col items-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Health and Fitness Club Management System
          <IconBarbell />
        </h1>
        <p className="flex gap-2 items-center max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          COMP 3005 - Fall 2025 Final Project: Henry L
        </p>
        <Separator />
        <h3 className="max-w-lg text-2xl font-medium leading-10 tracking-tight text-black dark:text-zinc-50">
          A fitness application with functionality for{" "}
          <i className="text-slate-400">members,</i>{" "}
          <i className="text-violet-400">trainers,</i> and{" "}
          <i className="text-blue-400">administrators.</i>
        </h3>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-8 m-4 items-stretch">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Members <IconUser />
            </CardTitle>
            <CardDescription>
              {" "}
              Gain access to features such as:
              <ul className="list-disc ml-2 mt-2">
                {" "}
                <li>Member Registration (Create a new account)</li>
                <li>Dashboard (Showing your latest stats and goals)</li>
                <li>
                  Profile Management (Update your details and fitness goals)
                </li>
                <li>Group Class Enrollments</li>
                <li>
                  Health Metrics (Track your weight and goals with timestamps)
                </li>
              </ul>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Trainers
              <IconUserFilled />
            </CardTitle>
            <CardDescription>
              {" "}
              Trainers will be able to:
              <ul className="list-disc ml-2 mt-2">
                <li>See assigned PT sessions and classes</li>
                <li>
                  Define time windows on when they can have sessions/classes
                </li>
              </ul>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Admin Staff
              <IconUserCog />
            </CardTitle>
            <CardDescription>
              {" "}
              Admins will be able to:
              <ul className="list-disc ml-2 mt-2">
                <li>Assign rooms for sessions or classes</li>
                <li>
                  Define new classes and assign trainers/rooms in accordance to
                  scheduling
                </li>
              </ul>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
