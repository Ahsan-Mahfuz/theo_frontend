import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="w-full px-8 py-10 max-w-[600px] mx-auto">
      <div className="bg-white rounded-[20px] border border-gray-50 p-8 lg:p-12 flex flex-col">
        {/* Accommodation header */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-[80px] h-[80px] rounded-[16px] shrink-0" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-3.5 w-40 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        </div>

        {/* Summary details */}
        <div className="flex flex-col gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-40 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          ))}
        </div>

        {/* Price details */}
        <Skeleton className="h-3 w-32 rounded mb-4" />
        <div className="flex flex-col gap-3 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <Skeleton className="h-3 w-32 rounded mb-4" />
        <div className="flex flex-col gap-2 mb-10">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>

        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </main>
  );
}
