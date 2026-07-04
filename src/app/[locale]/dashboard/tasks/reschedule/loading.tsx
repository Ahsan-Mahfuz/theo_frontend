import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-[600px] bg-white rounded-[24px] border border-gray-100 p-10 flex flex-col items-center">
        <SkeletonCircle size={56} className="mb-6" />
        <Skeleton className="h-4 w-56 rounded mb-2" />
        <Skeleton className="h-3 w-64 rounded mb-10" />

        <div className="w-full max-w-[400px] flex flex-col gap-6">
          <Skeleton className="h-3.5 w-32 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-[80px] h-[80px] rounded-xl shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-3.5 w-40 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
          </div>

          <Skeleton className="h-11 w-full rounded-xl mt-4" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
