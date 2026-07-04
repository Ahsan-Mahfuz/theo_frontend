'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n';
import { GlobalIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', labelKey: 'english' },
  { code: 'fr', flag: '🇫🇷', labelKey: 'french' },
] as const;

export default function LanguageTab() {
  const t = useTranslations('Settings.language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const selectLocale = (code: string) => {
    if (code === locale) return;
    // Re-navigate to the same page under the chosen locale — this reloads the
    // messages for that locale so every translated string switches.
    router.replace(pathname, { locale: code });
  };

  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300 w-full max-w-2xl mx-auto items-center mt-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="w-[60px] h-[60px] rounded-full bg-[#F5F9FF] flex items-center justify-center mb-5">
          <HugeiconsIcon icon={GlobalIcon} className="w-6 h-6 text-[#0084FF]" />
        </div>
        <h2 className="text-[20px] font-bold text-gray-900 mb-2">{t('title')}</h2>
        <p className="text-[13px] text-gray-500 max-w-[300px] leading-relaxed">{t('subtitle')}</p>
      </div>

      <div className="w-full flex flex-col gap-2 max-w-lg">
        {LANGUAGES.map((lang) => {
          const active = locale === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => selectLocale(lang.code)}
              className={`w-full h-14 px-4 rounded-2xl flex items-center justify-between transition-all ${
                active
                  ? 'bg-[#FAFAFA] border border-transparent'
                  : 'bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl leading-none">{lang.flag}</span>
                <span className={`text-[14px] ${active ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {t(lang.labelKey)}
                </span>
              </div>
              {active ? (
                <div className="w-[22px] h-[22px] rounded-full bg-[#0084FF] flex items-center justify-center">
                  <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-[22px] h-[22px] rounded-full border-2 border-gray-200"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
