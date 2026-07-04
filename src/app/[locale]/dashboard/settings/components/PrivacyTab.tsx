'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useGetContentQuery } from '@/store/api/contentApi';

export default function PrivacyTab() {
  const t = useTranslations('Settings.privacy');
  const { data } = useGetContentQuery('privacy_policy');
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
        <div className="w-full bg-[#F5F9FF] rounded-xl p-5 border border-blue-50 mb-4">
          <h3 className="text-[15px] font-bold text-[#0084FF] mb-2">{t('matterTitle')}</h3>
          <p className="text-[13px] text-blue-900/80">
            {t('matterBody')}
          </p>
        </div>

        <h3 className="text-[16px] font-bold text-gray-900 mt-2">{t('collectionTitle')}</h3>
        <p>
          {t('collectionBody')}
        </p>

        <h3 className="text-[16px] font-bold text-gray-900 mt-4">{t('usageTitle')}</h3>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>{t('usageItem1')}</li>
          <li>{t('usageItem2')}</li>
          <li>{t('usageItem3')}</li>
          <li>{t('usageItem4')}</li>
        </ul>

        <h3 className="text-[16px] font-bold text-gray-900 mt-4">{t('retentionTitle')}</h3>
        <p>
          {t('retentionBody')}
        </p>
      </div>
      )}
    </div>
  );
}
