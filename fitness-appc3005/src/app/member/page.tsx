import MemberClientPage from "./MemberClient";
import prisma from "../../../lib/prisma";

export default async function Member() {
  const members = await prisma.member.findMany();
  return <MemberClientPage members={members} />;
}
