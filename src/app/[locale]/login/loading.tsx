import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full bg-[#FAFAFA] items-center justify-center font-sans px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
          <Skeleton className="h-14 w-40 rounded mb-2" />
          <Skeleton className="h-6 w-2/3 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>

        <div className="w-full flex flex-col gap-1.5 mb-4">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        <div className="w-full flex flex-col gap-1.5 mb-4">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        <div className="w-full flex items-center justify-between mb-6">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>

        <Skeleton className="h-11 w-full rounded-lg" />

        <div className="w-full flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <Skeleton className="h-3 w-6 rounded" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <Skeleton className="h-4 w-48 rounded" />
      </div>
    </div>
  );
}
