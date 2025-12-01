import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ko', 'en', 'ja', 'zh'],

  // Used when no locale matches (fallback)
  defaultLocale: 'ko',

  // Locale prefix strategy - 'always' shows locale in URL for all languages
  localePrefix: 'always',

  // Detect browser language from Accept-Language header on first visit
  localeDetection: true
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
