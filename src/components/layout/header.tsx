import { AppImage } from '@/components/ui/app-image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { LanguageSwitcher } from '../ui/language-switcher';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('Landing');
  return (
    <header className="w-full absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 md:px-12 h-24 flex items-center justify-between relative">
        {/* Left side actions */}
        <div className="flex-1 flex items-center justify-start">
          <LanguageSwitcher />
        </div>

        {/* Centered Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <AppImage src="/logo.svg" alt="Gestlio" width={140} height={45} className="h-10 w-auto" />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6 justify-end flex-1">
          <Link href="/signup" className="text-sm font-semibold text-slate-800 hover:text-slate-600 transition-colors">
            {t('header.signUp')}
          </Link>
          <Link href="/login" tabIndex={-1}>
            <Button variant="outline" className="rounded-full px-6 h-11 border-slate-300 text-sm font-semibold hover:bg-slate-50">
              <HugeiconsIcon icon={UserIcon} className="mr-2 h-4 w-4" />
              {t('header.logIn')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
