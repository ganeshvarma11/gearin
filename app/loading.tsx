import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-20 w-full max-w-3xl" />
        <Skeleton className="h-16 w-full max-w-3xl rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
