import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
        <Skeleton className="h-6 w-2/3 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>

      <div className="w-full flex flex-col gap-1.5 mb-6">
        <Skeleton className="h-3 w-28 rounded" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>

      {/* Map area */}
      <Skeleton className="w-full h-48 sm:h-56 rounded-xl mb-6" />

      <div className="w-full flex flex-col gap-1.5 mb-6">
        <Skeleton className="h-3 w-40 rounded" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}
