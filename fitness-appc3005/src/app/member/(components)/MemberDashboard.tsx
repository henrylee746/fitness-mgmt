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
        <p className="text-sm">Weight (lbs): {currWeight ?? "N/A"} </p>
        <p className="text-muted-foreground text-sm">
          Last submitted: {lastSubmitted?.toLocaleDateString("en-CA") ?? "N/A"}
        </p>
        <Separator className="my-4 mb-6" />
        <div className="flex h-16 items-center justify-center space-x-6 text-xs lg:text-sm">
          <div className="text-center">
            Weight Target:{" "}
            <p className="font-bold leading-5"> {weightGoal ?? "N/A"} </p>
          </div>
          <Separator orientation="vertical" />
          <ul className="px-2 leading-5">
            <p className="font-bold">Past classes:</p>
            {pastClasses}
          </ul>
          <Separator orientation="vertical" />
          <div className="mt-4">
            <p className="font-bold leading-5 ">Upcoming Classes:</p>
            {upcomingClasses}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}
