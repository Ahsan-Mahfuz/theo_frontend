import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="flex flex-col gap-2 w-full mb-8">
        <Skeleton className="h-6 w-2/3 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>

      <div className="w-full flex flex-col gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Password security checklist */}
      <div className="w-full flex flex-col gap-2 mb-8">
        <Skeleton className="h-3 w-32 rounded mb-1" />
        <SkeletonText lines={3} />
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}
