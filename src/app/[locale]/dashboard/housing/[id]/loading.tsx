import { Skeleton } from '@/components/ui/skeleton';

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

        {/* Right Column - Details */}
        <div className="flex-1">
          <div className="bg-white rounded-[20px] border border-gray-50 p-8 lg:p-10 flex flex-col">
            <Skeleton className="w-full h-[300px] lg:h-[400px] rounded-[20px] mb-10" />

            <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
              {/* Specs */}
              <div className="flex-1 flex flex-col">
                <Skeleton className="h-4 w-1/2 rounded mb-1" />
                <Skeleton className="h-3 w-1/3 rounded mb-10" />
                <div className="flex flex-col gap-4 mb-10">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-3 w-32 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>

              {/* Practical info */}
              <div className="flex-1 flex flex-col gap-4">
                <Skeleton className="h-3 w-40 rounded mb-2" />
                <Skeleton className="h-20 w-full rounded-[12px]" />
                <Skeleton className="h-24 w-full rounded-[12px]" />
                <div className="mt-auto flex flex-col gap-3 pt-6">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
