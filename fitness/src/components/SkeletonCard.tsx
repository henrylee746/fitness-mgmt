import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export const SkeletonCard = () => {
  return (
    <Card className="w-full xl:max-w-2xl lg:max-w-lg md:max-w-md sm:max-w-md sm:max-w-sm max-w-xs">
      {" "}
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
};
