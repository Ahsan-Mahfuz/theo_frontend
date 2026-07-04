'use client';

import * as React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

const DEFAULT_PLACEHOLDER = '/placeholder.svg';
export const AVATAR_PLACEHOLDER = '/avatar-placeholder.svg';

type AppImageProps = Omit<ImageProps, 'src' | 'onError' | 'onLoad'> & {
  src?: string | null;
  /** Shown while loading and if the real image fails / is empty. */
  placeholderSrc?: string;
  /** Extra classes on the positioning wrapper (useful with `fill`). */
  wrapperClassName?: string;
  /** Hide the shimmer overlay while loading (image only, no skeleton). */
  disableSkeleton?: boolean;
};

/**
 * Drop-in replacement for next/image that:
 *  - shows a shimmering skeleton overlay until the image loads
 *  - falls back to a placeholder image when `src` is empty or fails to load
 *
 * Works in both `fill` mode and fixed `width`/`height` mode. When neither `fill`
 * nor width/height is given, it falls back to `fill` inside the wrapper.
 */
export function AppImage({
  src,
  alt,
  placeholderSrc = DEFAULT_PLACEHOLDER,
  wrapperClassName,
  className,
  fill,
  width,
  height,
  disableSkeleton,
  unoptimized = true,
  ...rest
}: AppImageProps) {
  const initialSrc = src && String(src).trim() !== '' ? src : placeholderSrc;
  const [currentSrc, setCurrentSrc] = React.useState(initialSrc);
  const [loaded, setLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const handleError = React.useCallback(() => {
    setCurrentSrc((prev) => {
      if (prev !== placeholderSrc) return placeholderSrc;
      setLoaded(true); // placeholder itself failed — stop showing the skeleton
      return prev;
    });
  }, [placeholderSrc]);

  React.useEffect(() => {
    const next = src && String(src).trim() !== '' ? src : placeholderSrc;
    setCurrentSrc(next);
    setLoaded(false);
  }, [src, placeholderSrc]);

  // Cached / SSR-rendered images are often already `complete` before React can
  // attach the onLoad handler, so onLoad never fires. Reveal any already-complete
  // image on mount / src change, otherwise the skeleton would stay forever.
  // (Genuine load failures still fire onError, which swaps in the placeholder.)
  React.useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [currentSrc]);

  const usesFill = fill || (width == null && height == null);

  const imageEl = (
    <Image
      {...rest}
      ref={imgRef}
      src={currentSrc}
      alt={alt ?? ''}
      unoptimized={unoptimized}
      {...(usesFill ? { fill: true } : { width, height })}
      onLoad={() => setLoaded(true)}
      onError={handleError}
      className={cn(
        className,
        'transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0'
      )}
    />
  );

  const skeleton =
    !disableSkeleton && !loaded ? (
      <span
        aria-hidden="true"
        className="skeleton-shimmer absolute inset-0 z-0 block bg-muted"
      />
    ) : null;

  // Fixed-size mode: wrapper takes the given dimensions.
  if (!usesFill) {
    return (
      <span
        className={cn(
          'relative inline-block overflow-hidden align-middle',
          wrapperClassName
        )}
        style={{ width, height }}
      >
        {skeleton}
        {imageEl}
      </span>
    );
  }

  // Fill mode: wrapper must be positioned; caller usually sizes it.
  return (
    <span className={cn('absolute inset-0 block overflow-hidden', wrapperClassName)}>
      {skeleton}
      {imageEl}
    </span>
  );
}

export default AppImage;
