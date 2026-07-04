import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

// Renders inside the Schedule layout (white rounded max-w-[900px] box already provided).
export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      {/* Top header block */}
      <div className="mb-10 flex flex-col">
        <Skeleton className="h-7 w-64 rounded-lg mb-6" />
        <div className="flex items-center gap-4 p-2">
          <Skeleton className="w-[100px] h-[100px] rounded-xl shrink-0" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-3.5 w-40 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        {/* Left column: form */}
        <div className="flex flex-col">
          <Skeleton className="h-4 w-48 rounded mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <SkeletonCircle size={40} />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-3.5 w-40 rounded" />
            </div>
          </div>
          <Skeleton className="h-3 w-28 rounded mb-3" />
          <div className="flex items-center gap-8 mb-8">
            <Skeleton className="h-12 w-32 rounded" />
            <Skeleton className="h-12 w-32 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <SkeletonCircle size={40} />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
        </div>

        {/* Right column: summary */}
        <div className="flex flex-col">
          <Skeleton className="h-4 w-32 rounded mb-6" />
          <div className="flex flex-col gap-4 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            ))}
          </div>
          <Skeleton className="h-4 w-32 rounded mb-6" />
          <div className="flex flex-col gap-3 mb-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-11 w-48 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
