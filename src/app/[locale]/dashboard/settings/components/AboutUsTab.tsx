'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useGetContentQuery } from '@/store/api/contentApi';

export default function AboutUsTab() {
  const t = useTranslations('Settings.about');
  const { data } = useGetContentQuery('about_us');
  const html = typeof data?.content === 'string' ? data.content.trim() : '';

  return (
    <div className="flex flex-col animate-in fade-in duration-300 max-w-3xl">
      <h2 className="text-[24px] font-bold text-gray-900 mb-6">{t('title')}</h2>
      {html ? (
        <div
          className="flex flex-col gap-6 text-[14px] text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
      <div className="flex flex-col gap-6 text-[14px] text-gray-600 leading-relaxed">
        <p>
          {t.rich('intro', { strong: (chunks) => <strong className="text-gray-900">{chunks}</strong> })}
        </p>
        <div className="w-full bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">{t('visionTitle')}</h3>
          <p>
            {t('visionBody')}
          </p>
        </div>
        <p>
          {t('outro')}
        </p>
      </div>
      )}
    </div>
  );
}
