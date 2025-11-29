import prisma from "@/lib/prisma";
import MemberRegistration from "../(components)/MemberRegistration";
import MemberSelect from "../(components)/MemberSelect";
import ProfileManagement from "../(components)/ProfileManagement";
import MemberDashboard from "../(components)/MemberDashboard";
import GroupClass from "../(components)/GroupClass";
import DefaultPage from "../(components)/DefaultPage";

export default async function Members({
  params,
}: {
  params: Promise<{ id: string[] | undefined }>;
}) {
  const { id } = await params;

  /*To get initial list of members for dropdown*/
  const members = await prisma.member.findMany({});
  const memberId = id ? Number(id) : undefined;
  //Need the undefined guard because when user first navigates to
  //Members panel, no member is selected therefore no param id
  const member = id
    ? await prisma.member.findUnique({
        where: { id: memberId },
        include: {
          metrics: true,
          bookings: {
            include: {
              session: true,
            },
          },
        },
      })
    : null;
  const sessions = await prisma.session.findMany({
    where: {
      dateTime: {
        gte: new Date(),
      },
    },
    include: {
      room: true,
      trainer: true,
    },
  });

  return (
    <>
      <h1 className="max-w-s mb-4 text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Member's Hub
      </h1>
      <div
        className={`dark:bg-stone-950 h-full flex flex-col items-center ${
          id ? "justify-center" : "justify-start py-8"
        } bg-zinc-50 font-sans`}
      >
        <div className="flex gap-4">
          <MemberSelect members={members} id={id} />
          <MemberRegistration />
        </div>

        {id ? (
          <div className="flex flex-wrap items-center justify-center w-full mt-8 mb-4 gap-8">
            <ProfileManagement id={id} />

            <div className="flex flex-col gap-6">
              <MemberDashboard member={member} />

              <GroupClass sessions={sessions} member={member} />
            </div>
          </div>
        ) : (
          <DefaultPage />
        )}
      </div>
    </>
  );
}
