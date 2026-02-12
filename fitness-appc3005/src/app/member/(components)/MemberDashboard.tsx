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
import { MemberExtended } from "@/lib/types";
import { Booking } from "@/lib/types";

export default async function MemberDashboard({
  member,
}: {
  member: MemberExtended | null;
}) {
  const currWeight = member?.metrics[member.metrics.length - 1]?.weight;
  const lastSubmitted = member?.metrics[member.metrics.length - 1]?.timestamp;
  const weightGoal = member?.metrics[member.metrics.length - 1]?.weightGoal;
  const pastClasses = member
    ? member?.bookings.filter(
      (booking: Booking) => booking.classSession.dateTime < new Date()
    ).length > 0
      ? member?.bookings.map((booking: Booking) => (
        <div key={booking.classSessionId}>
          {booking.classSession.dateTime < new Date() ? (
            <li className="list-disc">{booking.classSession.name}</li>
          ) : null}
        </div>
      ))
      : "N/A"
    : null;
  const upcomingClasses = member
    ? member?.bookings.filter(
      (booking: Booking) => booking.classSession.dateTime > new Date()
    ).length > 0
      ? member?.bookings.map((booking: Booking) => (
        <div key={booking.classSessionId}>
          {booking.classSession.dateTime > new Date() ? (
            <li className="list-disc">{booking.classSession.name}</li>
          ) : null}
        </div>
      ))
      : "N/A"
    : null;

  return (
    <Card className="w-full xl:max-w-2xl lg:max-w-lg md:max-w-md sm:max-w-sm max-w-xs">
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
        <div className="flex items-end justify-between mb-1">
          <div>
            <p className="text-3xl font-bold">{currWeight ?? "N/A"} <span className="text-sm font-normal text-muted-foreground">lbs</span></p>
            <p className="text-muted-foreground text-xs mt-1">
              Last updated: {lastSubmitted?.toLocaleDateString("en-CA") ?? "N/A"}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex flex-col gap-1 rounded-lg  p-3">
            <p className="text-xs text-muted-foreground">Weight Target</p>
            <p className="font-semibold">{weightGoal ?? "N/A"} <span className="text-xs font-normal">lbs</span></p>
          </div>
          <div className="flex flex-col gap-1 rounded-lg  p-3">
            <p className="text-xs text-muted-foreground font-semibold">Past Classes</p>
            <ul>{pastClasses}</ul>
          </div>
          <div className="flex flex-col gap-1 rounded-lg  p-3">
            <p className="text-xs text-muted-foreground font-semibold">Upcoming</p>
            <ul>{upcomingClasses}</ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}
