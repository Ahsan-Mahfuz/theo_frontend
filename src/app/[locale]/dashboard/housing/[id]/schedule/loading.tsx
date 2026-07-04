import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="w-full px-8 py-10 mx-auto">
      <Skeleton className="h-8 w-72 rounded-lg mb-10" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Accommodation Card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-[20px] p-4 border border-gray-50 flex flex-col gap-4">
            <Skeleton className="w-full aspect-[4/3] rounded-[16px]" />
            <div className="flex flex-col gap-2 px-2 pb-2">
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        </div>

        {/* Right Column - Schedule Details */}
        <div className="flex-1">
          <div className="bg-white rounded-[20px] border border-gray-50 p-8 lg:p-10 flex flex-col">
            <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
              {/* Cleaning Information */}
              <div className="flex-1 flex flex-col">
                <Skeleton className="h-4 w-48 rounded mb-8" />
                <div className="flex flex-col gap-8 mb-8">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <SkeletonCircle size={32} />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-3 w-28 rounded" />
                        <Skeleton className="h-10 w-48 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton className="h-4 w-24 rounded mb-6" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SkeletonCircle size={38} />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-2.5 w-16 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-[34px] w-20 rounded-xl" />
                </div>
              </div>

              {/* Summary */}
              <div className="flex-1 flex flex-col">
                <Skeleton className="h-4 w-32 rounded mb-8" />
                <div className="flex flex-col gap-5 mb-12">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-3 w-32 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-4 w-32 rounded mb-6" />
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-3 w-32 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-10 flex justify-end">
                  <Skeleton className="h-12 w-[120px] rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
