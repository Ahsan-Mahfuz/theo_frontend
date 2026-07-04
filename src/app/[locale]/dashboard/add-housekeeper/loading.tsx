import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

// Renders inside the Add Housekeeper layout (white rounded max-w-[900px] box already provided).
export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      {/* Search bar */}
      <div className="w-full max-w-[500px] mx-auto mb-6">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      <div className="w-full max-w-[600px] mx-auto">
        <Skeleton className="h-3 w-48 rounded mb-4 px-1" />

        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#FAFAFA] rounded-2xl p-5 flex items-start gap-4">
              <SkeletonCircle size={56} />
              <div className="flex flex-col flex-1 gap-2">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
                <Skeleton className="h-3 w-full rounded mt-1" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
