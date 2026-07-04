import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="w-full h-16 border-b border-gray-100 flex items-center justify-between px-4 sm:px-8">
        <Skeleton className="h-8 w-32 rounded" />
        <div className="hidden sm:flex items-center gap-6">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-16 flex flex-col items-center text-center gap-6">
          <Skeleton className="h-10 sm:h-12 w-3/4 rounded-lg" />
          <Skeleton className="h-10 sm:h-12 w-2/3 rounded-lg" />
          <SkeletonText lines={3} className="w-full max-w-xl mt-2" />
          <div className="flex items-center gap-4 mt-4">
            <Skeleton className="h-11 w-36 rounded-lg" />
            <Skeleton className="h-11 w-36 rounded-lg" />
          </div>
          <Skeleton className="w-full max-w-4xl h-72 sm:h-96 rounded-2xl mt-8" />
        </section>

        {/* Feature cards */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6"
            >
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="h-5 w-2/3 rounded" />
              <SkeletonText lines={3} />
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <div className="w-full border-t border-gray-100 px-4 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-4 w-24 rounded" />
              <SkeletonText lines={3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
