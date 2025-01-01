import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="container mx-auto py-10 px-4">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="grid md:grid-cols-[300px,1fr] gap-8">
        <Card className="p-4">
          <Skeleton className="h-[300px] w-full" />
        </Card>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}