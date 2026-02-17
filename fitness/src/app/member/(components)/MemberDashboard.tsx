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
          <span style={{ fontFamily: "var(--font-display)" }} className="font-black uppercase tracking-wide text-2xl leading-none">
            Dashboard
          </span>
          <IconDashboardFilled className="text-primary" />
        </CardTitle>
        <CardDescription className="text-xs tracking-wider uppercase">
          Check your metrics and upcoming sessions here
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between mb-1">
          <div>
            <p
              className="font-black leading-none"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 3.5rem)" }}
            >
              {currWeight ?? "N/A"} <span className="text-base font-sans font-normal text-muted-foreground">lbs</span>
            </p>
            <p className="text-muted-foreground text-xs mt-2 tracking-wider uppercase">
              Last updated: {lastSubmitted?.toLocaleDateString("en-CA") ?? "N/A"}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex flex-col gap-1 p-3 bg-primary/5">
            <p className="text-xs text-muted-foreground tracking-wider uppercase">Weight Target</p>
            <p className="font-semibold">{weightGoal ?? "N/A"} <span className="text-xs font-normal">lbs</span></p>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-primary/5">
            <p className="text-xs text-muted-foreground tracking-wider uppercase">Past Classes</p>
            <ul className="list-disc pl-3">{pastClasses}</ul>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-primary/5">
            <p className="text-xs text-muted-foreground tracking-wider uppercase">Upcoming</p>
            <ul className="list-disc pl-3">{upcomingClasses}</ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}
