import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-4">
        <Skeleton className="h-6 w-1/2 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>

      {/* Summary rows */}
      <div className="w-full flex flex-col gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-full flex flex-col gap-1.5 mb-4">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <Skeleton className="h-11 w-full rounded-lg mt-4" />
      <Skeleton className="h-11 w-full rounded-lg mt-4" />
    </div>
  );
}
