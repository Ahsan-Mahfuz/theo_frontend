import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="w-full px-8 py-10 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <Skeleton className="h-8 w-40 rounded-lg" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Left sidebar menu */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col">
          <div className="flex flex-col mb-8">
            <Skeleton className="h-3 w-40 rounded mb-4 mx-2" />
            <div className="flex flex-col gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <Skeleton className="h-3 w-40 rounded mb-4 mx-2" />
            <div className="flex flex-col gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Right main content */}
        <div className="flex-1 w-full bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 min-h-[600px]">
          <Skeleton className="h-6 w-56 rounded mb-8" />
          <div className="flex flex-col gap-5 max-w-[600px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
            <Skeleton className="h-12 w-40 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    </main>
  );
}
