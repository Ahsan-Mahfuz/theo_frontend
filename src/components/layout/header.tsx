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
      <div className="container mx-auto px-4 sm:px-6 md:px-12 h-20 md:h-24 flex items-center justify-between relative">
        {/* Left side actions */}
        <div className="flex-1 flex items-center justify-start z-20">
          <LanguageSwitcher />
        </div>

        {/* Centered Logo */}
        <Link href="/" className="absolute top-0 left-1/2 -translate-x-1/2 mt-6 ml-5 z-10">
          <AppImage src="/logo.svg" alt="Gestlio" width={140} height={45} className="h-7 sm:h-8 md:h-10 w-auto" />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-6 justify-end flex-1 z-20">
          <Link href="/signup" className="hidden md:block text-sm font-semibold text-slate-800 hover:text-slate-600 transition-colors">
            {t('header.signUp')}
          </Link>
          <Link href="/login" tabIndex={-1}>
            <Button variant="outline" className="rounded-full px-3 sm:px-4 md:px-6 h-9 md:h-11 border-slate-300 text-[13px] md:text-sm font-semibold hover:bg-slate-50 flex items-center">
              <HugeiconsIcon icon={UserIcon} className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('header.logIn')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
