'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useGetContentQuery } from '@/store/api/contentApi';

export default function LegalTab() {
  const t = useTranslations('Settings.legal');
  const { data } = useGetContentQuery('legal_notice');
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
        
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-bold text-gray-900">{t('companyInfoTitle')}</h3>
          <p><strong>{t('companyNameLabel')}</strong> Gestlio SAS</p>
          <p><strong>{t('headquartersLabel')}</strong> 12 Rue de Charenton, 75012 Paris, France</p>
          <p><strong>{t('registrationNumberLabel')}</strong> 123 456 789 RCS Paris</p>
          <p><strong>{t('vatNumberLabel')}</strong> FR 12 3456789</p>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-bold text-gray-900">{t('contactTitle')}</h3>
          <p><strong>{t('emailLabel')}</strong> legal@gestlio.com</p>
          <p><strong>{t('phoneLabel')}</strong> +33 1 23 45 67 89</p>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-bold text-gray-900">{t('hostingProviderTitle')}</h3>
          <p><strong>{t('providerLabel')}</strong> Amazon Web Services EMEA SARL</p>
          <p><strong>{t('addressLabel')}</strong> 38 Avenue John F. Kennedy, L-1855, Luxembourg</p>
        </div>

        <div className="w-full bg-[#FAFAFA] rounded-2xl p-5 border border-gray-100 mt-4">
          <p className="text-[13px] text-gray-500 italic">
            {t('disclaimer')}
          </p>
        </div>

      </div>
      )}
    </div>
  );
}
