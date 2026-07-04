import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="flex flex-col gap-2 w-full mb-8">
        <Skeleton className="h-6 w-2/3 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
      <div className="w-full flex flex-col gap-4 mb-6">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}
