import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'en' as const;

export const routing = defineRouting({
  locales,
  defaultLocale
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);