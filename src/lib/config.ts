// Central place for API endpoints. Values come from .env.local at build time and
// fall back to the running backend so the app works out of the box.

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.10.28.192:6050/api/v1';

export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || 'http://10.10.28.192:6050';

// localStorage keys used to persist the auth session across reloads.
export const TOKEN_KEY = 'gestlio_token';
export const USER_KEY = 'gestlio_user';

// Turn a backend-relative asset path (e.g. "/uploads/profiles/x.png") into an
// absolute URL. Absolute URLs and empty values are returned untouched.
export const resolveAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
};
