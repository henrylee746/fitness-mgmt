"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MemberSelect({
  members,
  id,
}: {
  members: any;
  id: string[] | undefined;
}) {
  const router = useRouter();

  const handleChange = (id: string) => {
    router.push(`/member/${id}`);
  };
  return (
    <Select value={id?.[0]} onValueChange={(value) => handleChange(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a member" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Members</SelectLabel>
          {members.map((member: any) => (
            <SelectItem value={String(member.id)} key={member.id}>
              {member.firstName + " " + member.lastName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
