import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="w-full px-8 py-10 max-w-[1200px] mx-auto">
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

        {/* Right Column - Edit Form */}
        <div className="flex-1">
          <div className="bg-white rounded-[20px] border border-gray-50 p-8 lg:p-12 flex flex-col max-w-[600px] mx-auto">
            <Skeleton className="w-[120px] h-[120px] mx-auto rounded-[16px] mb-8" />

            <div className="flex flex-col items-center gap-2 mb-8">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
            </div>

            <div className="flex flex-col gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl mt-8" />
          </div>
        </div>
      </div>
    </main>
  );
}
