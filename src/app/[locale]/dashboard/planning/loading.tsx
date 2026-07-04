import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="w-full px-8 py-10 mx-auto">
      {/* Header */}
      <div className="mb-10">
        <Skeleton className="h-8 w-40 rounded-lg" />
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Left Column - Accommodation List */}
        <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl p-3 flex flex-col sm:flex-row gap-4 bg-white border border-gray-100">
              <Skeleton className="w-[140px] h-[90px] rounded-[14px] shrink-0" />
              <div className="flex flex-col gap-2 py-1">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Calendar Area */}
        <div className="flex-1 w-full bg-white rounded-[24px] border border-gray-50 min-h-[600px] p-8">
          {/* Segmented control */}
          <Skeleton className="w-full max-w-[500px] mx-auto h-12 rounded-2xl mb-8" />

          {/* Month navigation */}
          <div className="flex items-center justify-between px-4 mb-8">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>

          {/* Weekday row */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full rounded" />
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-6 gap-x-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>

          <Skeleton className="mt-8 h-12 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
