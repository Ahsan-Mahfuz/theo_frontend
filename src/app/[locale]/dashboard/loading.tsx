import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="w-full px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-11 w-48 rounded-xl" />
          <Skeleton className="h-11 w-48 rounded-xl" />
        </div>
      </div>

      {/* Recommended Schedule */}
      <section className="mb-12">
        <Skeleton className="h-5 w-52 rounded mb-2" />
        <Skeleton className="h-3.5 w-80 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex gap-4">
              <Skeleton className="w-[150px] h-[150px] rounded-xl shrink-0" />
              <div className="flex flex-col flex-1 gap-2 py-1">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
                <div className="flex gap-2 mt-1">
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                </div>
                <div className="flex items-center gap-3 mt-auto pt-1">
                  <SkeletonCircle size={40} />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* To Do */}
      <section className="mb-20">
        <Skeleton className="h-5 w-32 rounded mb-2" />
        <Skeleton className="h-3.5 w-72 rounded mb-6" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-4 w-40 rounded" />
                  <div className="flex items-center gap-1.5">
                    <SkeletonCircle size={20} />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
