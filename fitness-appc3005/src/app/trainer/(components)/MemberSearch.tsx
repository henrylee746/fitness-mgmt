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
import { MemberInfo } from "@/lib/types";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

export default function MemberSearch() {
  const [results, setResults] = useState<MemberInfo[]>([]);
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState("");
  const [loading, setLoading] = useState(false);

  //async function for looking up member by name (calls /api/member/search)
  /*would normally use this as a server action 
    can be used for multiple purposes */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    try {
      setLoading(true);
      const res = await fetch("/api/member/search", {
        method: "POST",
        body: JSON.stringify({ name: query }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.length === 0) {
        setNotFound("No results found.");
      } else {
        setResults(data);
        setNotFound("");
      }
    } catch (error) {
      toast.error(`Failed to search members: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full xl:max-w-xl md:max-w-lg max-w-xs">
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

            <Button type="submit" variant="outline" disabled={loading}>
              {loading ? <Loader /> : "Search"}
            </Button>
          </div>

          {/* Render results */}
          {results.length > 0 ? (
            <ul className="p-4">
              {results.map((member) => (
                <li key={member.email} className="list-disc py-2">
                  {member.firstName} {member.lastName} - {member.email}
                  <p className="text-muted-foreground text-sm">
                    Weight: {member?.weight ?? "N/A"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {" "}
                    Weight Target: {member?.weightGoal ?? "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">{notFound}</p>
          )}
        </CardContent>
      </form>
    </Card>
  );
}
