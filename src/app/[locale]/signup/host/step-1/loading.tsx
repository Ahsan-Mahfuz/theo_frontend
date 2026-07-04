import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
        <Skeleton className="h-14 w-40 rounded mb-4" />
        <Skeleton className="h-6 w-2/3 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>

      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Account choice cards */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
            </div>
            <SkeletonText lines={3} />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
