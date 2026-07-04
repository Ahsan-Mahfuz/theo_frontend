import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full max-w-md flex flex-col items-center text-center">
      <Skeleton className="h-7 w-2/3 rounded mb-2 mt-4" />
      <Skeleton className="h-4 w-1/2 rounded mb-8" />

      <div className="w-full flex flex-col gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4 text-left"
          >
            <SkeletonCircle size={32} />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-3.5 w-2/3 rounded" />
              <Skeleton className="h-3 w-full rounded" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}
