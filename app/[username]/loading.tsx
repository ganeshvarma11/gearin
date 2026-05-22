import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <main className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </main>
  );
}
