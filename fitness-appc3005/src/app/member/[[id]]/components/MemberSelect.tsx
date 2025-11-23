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

export default function MemberSelect({ members }: any) {
  const router = useRouter();

  const handleChange = (id: string) => {
    router.push(`/member/${id}`);
  };
  return (
    <Select
      defaultValue={members[0].id}
      onValueChange={(value) => handleChange(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a member" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Members</SelectLabel>
          {members.map((member: any) => (
            <SelectItem value={member.id} key={member.id}>
              {member.firstName + " " + member.lastName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
