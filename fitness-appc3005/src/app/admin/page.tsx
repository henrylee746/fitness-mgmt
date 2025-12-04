import prisma from "@/lib/prisma";
import RoomBooking from "./(components)/RoomBooking";
import ClassManagement from "./(components)/ClassManagement";

export default async function Admin() {
  const sessions = await prisma.session.findMany({
    where: {
      dateTime: {
        gte: new Date(),
      },
    },
    include: {
      //Joins with room and trainer tables
      room: true,
      trainer: true,
    },
  });

  const trainers = await prisma.trainer.findMany();

  return (
    <>
      <h1 className="max-w-s mb-4 text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Admin Portal
      </h1>
      <div className="h-full flex flex-col lg:flex-row flex-wrap flex-1 items-center justify-center font-sans gap-8 p-4">
        <RoomBooking sessions={sessions} />
        <ClassManagement trainers={trainers} />
      </div>
    </>
  );
}
