"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconZoomCheck } from "@tabler/icons-react";
import React, { useState } from "react";

export default function MemberSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  //async function for looking up member by name (calls /api/member/search)
  /*would normally use this as a server action but the api route 
    can be used for multiple purposes */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    const res = await fetch("/api/member/search", {
      method: "POST",
      body: JSON.stringify({ name: query }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
    setResults(data);
  };

  return (
    <Card className="w-full lg:max-w-lg md:max-w-md sm:max-w-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            Member Search <IconZoomCheck />
          </CardTitle>
          <CardDescription>
            Search members by name (case-insensitive) to view their current
            weight goal and last measured weight.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Henry Lee"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" variant="outline">
              Search
            </Button>
          </div>

          {/* Render results */}
          {results.length > 0 && (
            <ul className="p-4">
              {results.map((member) => (
                <li key={member.id} className="list-disc py-2">
                  {member.firstName} {member.lastName} - {member.email}
                  <p className="text-muted-foreground text-sm">
                    Weight: {member?.metrics[member.metrics.length - 1].weight}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {" "}
                    Weight Target:{" "}
                    {member?.metrics[member.metrics.length - 1].weightGoal}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </form>
    </Card>
  );
}
