'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function DashboardFooter() {
  const t = useTranslations('Dashboard.footer');
  return (
    <footer className="w-full border-t border-gray-200 bg-[#FAFAFA] py-8 mt-auto">
      <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between text-[12px] text-gray-500">
        <div>{t('rights', { year: new Date().getFullYear() })}</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/dashboard/settings?tab=privacy" className="hover:text-gray-900 transition-colors">{t('privacyPolicy')}</Link>
          <Link href="/dashboard/settings?tab=terms" className="hover:text-gray-900 transition-colors">{t('termsOfService')}</Link>
          <Link href="/dashboard/settings?tab=legal" className="hover:text-gray-900 transition-colors">{t('legalNotice')}</Link>
        </div>
      </div>
    </footer>
  );
}
