import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="w-full px-8 py-10 mx-auto">
      <Skeleton className="h-8 w-80 rounded-lg mb-10" />

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

        {/* Right Column - Cleaners Management */}
        <div className="flex-1">
          <div className="bg-white rounded-[20px] border border-gray-50 p-8 lg:p-10 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <Skeleton className="h-3.5 w-72 rounded" />
              <Skeleton className="h-[38px] w-32 rounded-xl" />
            </div>

            <Skeleton className="h-4 w-40 rounded mb-4" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#FAFAFA] rounded-[16px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SkeletonCircle size={60} />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3.5 w-32 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-3 w-40 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-[30px] w-24 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
