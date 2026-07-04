// Pull a human-readable message out of an RTK Query error object.
export const getApiErrorMessage = (
  err: unknown,
  fallback = 'Something went wrong. Please try again.',
): string => {
  if (!err || typeof err !== 'object') return fallback;
  const e = err as { data?: { message?: string; error?: string }; error?: string };
  return e.data?.message || e.data?.error || e.error || fallback;
};
