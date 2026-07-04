import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

// Renders inside the Schedule layout (white rounded max-w-[900px] box already provided).
export default function Loading() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Heading */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <Skeleton className="h-5 w-72 rounded" />
        <Skeleton className="h-3 w-96 max-w-full rounded" />
      </div>

      {/* Property list */}
      <div className="w-full max-w-[500px] flex flex-col gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full rounded-2xl border border-gray-100 bg-white p-3 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Skeleton className="w-[100px] h-[100px] rounded-xl shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </div>
            <SkeletonCircle size={20} />
          </div>
        ))}
      </div>

      <Skeleton className="w-full max-w-[500px] h-16 rounded-xl mb-6" />
      <Skeleton className="w-full max-w-[500px] h-12 rounded-xl" />
    </div>
  );
}
