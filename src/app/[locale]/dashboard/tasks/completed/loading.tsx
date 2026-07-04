import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      <div className="mb-10 flex flex-col">
        <Skeleton className="h-8 w-64 rounded-lg mb-8" />

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left column: property card */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-col sm:flex-row gap-6 w-full lg:w-[400px] shrink-0">
            <Skeleton className="w-[120px] h-[120px] rounded-2xl shrink-0" />
            <div className="flex flex-col py-1 flex-1 gap-2">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-24 rounded mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-28 rounded" />
                <Skeleton className="h-8 w-24 rounded" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <SkeletonCircle size={24} />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
            </div>
          </div>

          {/* Right column: photos + notes */}
          <div className="flex-1 w-full bg-white rounded-[24px] border border-gray-100 overflow-hidden max-w-[500px]">
            <Skeleton className="w-full h-12 rounded-none" />
            <div className="p-4 flex flex-col">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl mb-4" />
              <div className="flex flex-col gap-2 mb-6">
                <Skeleton className="h-3.5 w-48 rounded" />
                <Skeleton className="h-3 w-full rounded" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="h-11 flex-1 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
