import { Separator } from "@/components/ui/separator";
import { IconDashboardFilled } from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "../../../../../lib/prisma";

export default async function MemberDashboard(id: string, defaultMember: any) {
  const member = await prisma.member.findUnique({
    where: { id: Number(id) },
    include: {
      metrics: true,
      bookings: {
        include: {
          session: true,
        },
      },
    },
  });

  console.log(member);
  return (
    <Card className="w-full xl:max-w-xl md:max-w-md lg:max-w-lg sm:max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Dashboard
          <IconDashboardFilled />
        </CardTitle>
        <CardDescription>
          Check your metrics and upcoming sessions here
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          Date: {new Date().toLocaleDateString("en-CA")}
        </p>
        <p className="text-sm">Weight: lbs</p>
        <Separator className="my-4" />
        <div className="flex h-8 items-center space-x-4 text-xs lg:text-sm">
          <div>Weight Goal: lbs</div>
          <Separator orientation="vertical" />
          <div>Classes Upcoming: </div>
          <Separator orientation="vertical" />
          <div>Upcoming Classes: </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}
