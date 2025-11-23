import { Separator } from "@/components/ui/separator";
import { IconDashboardFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "../../../../lib/prisma";
import { IconCalendarUser } from "@tabler/icons-react";
import { DataTable } from "./data-table";
import { sessionColumns, Session, Health } from "./columns";
import MemberRegistration from "./components/MemberRegistration";
import MemberSelect from "./components/MemberSelect";
import ProfileManagement from "./components/ProfileManagement";
import MemberDashboard from "./components/MemberDashboard";

export default async function Members({ params }: { params: { id: string } }) {
  const members = await prisma.member.findMany();

  return (
    <div className="dark:bg-stone-950 h-full flex flex-col items-center justify-center bg-zinc-50 font-sans">
      <h1 className="max-w-s mb-4 text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Member's Hub
      </h1>

      <div className="flex gap-4">
        <MemberSelect members={members} />
        <MemberRegistration />
      </div>

      <div className="flex flex-wrap items-center justify-center w-full mt-8 mb-4 gap-8">
        <ProfileManagement />

        <div className="flex flex-col gap-6">
          <MemberDashboard id={params.id} defaultMember={members[0]} />

          <Card className="w-full 2xl:max-w-2xl xl:max-w-xl lg:max-w-lg md:max-w-md sm:max-w-sm">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                Group Class Registration <IconCalendarUser />
              </CardTitle>
              <CardDescription>
                Register for upcoming group sessions here
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full">Register</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
