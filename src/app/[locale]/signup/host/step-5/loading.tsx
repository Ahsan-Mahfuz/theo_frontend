import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full max-w-md flex flex-col items-center text-center">
      <div className="mb-6">
        <SkeletonCircle size={96} />
      </div>

      <Skeleton className="h-7 w-2/3 rounded mb-2" />
      <Skeleton className="h-4 w-3/4 rounded mb-8" />

      <div className="w-full border border-gray-200 rounded-xl p-5 bg-white text-left mb-8">
        <Skeleton className="h-4 w-32 rounded mb-4" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonCircle size={20} />
              <Skeleton className="h-3.5 w-40 rounded" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />
      <Skeleton className="h-11 w-full rounded-lg mt-3" />
    </div>
  );
}
