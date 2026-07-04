import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Base skeleton block. Renders a muted, shimmering placeholder.
 * Compose these to mirror the layout of the content being loaded.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer rounded-md bg-muted', className)}
      {...props}
    />
  );
}

/** One or more skeleton lines mimicking a text block. */
export function SkeletonText({
  lines = 3,
  className,
  lineClassName,
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-3.5 rounded',
            i === lines - 1 ? 'w-2/3' : 'w-full',
            lineClassName
          )}
        />
      ))}
    </div>
  );
}

/** A circular skeleton, e.g. for avatars. Pass a size class or use `size`. */
export function SkeletonCircle({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      className={cn('rounded-full shrink-0', className)}
      style={{ width: size, height: size }}
    />
  );
}

/** A generic card skeleton: image block + a few text lines. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-white rounded-[20px] p-4 border border-gray-50 flex flex-col sm:flex-row gap-4 min-h-[260px]',
        className
      )}
    >
      <Skeleton className="w-full sm:w-[190px] h-[190px] sm:h-auto rounded-[16px] shrink-0" />
      <div className="flex flex-col flex-1 gap-3 py-1">
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <div className="flex items-center gap-2 mt-4">
          <SkeletonCircle size={24} />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
