import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="w-full px-8 py-10 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 shrink-0">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="h-11 w-full md:w-[280px] rounded-xl" />
      </div>

      {/* Messaging Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Chat list */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full p-4 rounded-2xl flex items-center gap-3 bg-white border border-gray-100">
              <SkeletonCircle size={40} />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Active chat */}
        <div className="flex-1 bg-white border border-gray-100 rounded-[24px] flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="h-20 border-b border-gray-100 px-6 flex items-center gap-4 shrink-0">
            <SkeletonCircle size={48} />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 flex flex-col gap-3">
            <Skeleton className="h-10 w-1/2 rounded-2xl self-start" />
            <Skeleton className="h-10 w-2/5 rounded-2xl self-end" />
            <Skeleton className="h-10 w-3/5 rounded-2xl self-start" />
            <Skeleton className="h-10 w-1/3 rounded-2xl self-end" />
          </div>

          {/* Input */}
          <div className="p-6 shrink-0">
            <Skeleton className="h-16 w-full rounded-[32px]" />
          </div>
        </div>
      </div>
    </main>
  );
}
