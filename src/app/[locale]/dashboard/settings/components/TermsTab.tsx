'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useGetContentQuery } from '@/store/api/contentApi';

export default function TermsTab() {
  const t = useTranslations('Settings.terms');
  const { data } = useGetContentQuery('terms_of_use');
  const html = typeof data?.content === 'string' ? data.content.trim() : '';

  return (
    <div className="flex flex-col animate-in fade-in duration-300 max-w-3xl">
      <h2 className="text-[24px] font-bold text-gray-900 mb-6">{t('title')}</h2>
      {html ? (
        <div
          className="flex flex-col gap-8 text-[14px] text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
      <div className="flex flex-col gap-8 text-[14px] text-gray-600 leading-relaxed">
        <section>
          <h3 className="text-[16px] font-bold text-gray-900 mb-2">{t('section1Title')}</h3>
          <p>
            {t('section1Body')}
          </p>
        </section>
        <section>
          <h3 className="text-[16px] font-bold text-gray-900 mb-2">{t('section2Title')}</h3>
          <p>
            {t('section2Body')}
          </p>
        </section>
        <section>
          <h3 className="text-[16px] font-bold text-gray-900 mb-2">{t('section3Title')}</h3>
          <p>
            {t('section3Body')}
          </p>
        </section>
        <section>
          <h3 className="text-[16px] font-bold text-gray-900 mb-2">{t('section4Title')}</h3>
          <p>
            {t('section4Body')}
          </p>
        </section>
      </div>
      )}
    </div>
  );
}
