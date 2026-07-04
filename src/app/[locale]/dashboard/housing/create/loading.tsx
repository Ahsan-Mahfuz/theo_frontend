import { Skeleton } from '@/components/ui/skeleton';

// Renders inside the Create Accommodation layout (heading + max-w-4xl main already provided),
// so this mirrors only the step content (step indicator + form fields).
export default function Loading() {
  return (
    <div className="flex flex-col items-center">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-8 h-8 rounded-full" />
        ))}
      </div>

      {/* Section heading */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <Skeleton className="h-4 w-48 rounded" />
        <Skeleton className="h-3 w-72 rounded" />
      </div>

      {/* Form */}
      <div className="w-full max-w-lg flex flex-col gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-40 rounded" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-xl mt-4" />
      </div>
    </div>
  );
}
