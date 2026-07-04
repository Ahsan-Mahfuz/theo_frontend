'use client';

import React from 'react';
import { AppImage } from '@/components/ui/app-image';
import { useRouter } from 'next/navigation';
import { 
  CheckmarkBadge01Icon, 
  Home01Icon, 
  Tick02Icon, 
  ArrowRight01Icon, 
  SmartPhone01Icon, 
  InformationCircleIcon 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export default function Step1Page() {
  const router = useRouter();
  const t = useTranslations('Signup');

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
        <AppImage src="/brand-logo.svg" alt="Logo" width={160} height={60} className="mb-4" />
        <h2 className="text-[20px] text-gray-900 font-semibold">{t('step1.heading')}</h2>
        <p className="text-[14px] text-gray-500">
          {t('step1.subtitle')}
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Host Account Card */}
        <div className="border-[1.5px] border-[#0084FF] rounded-xl p-5 bg-white relative shadow-sm">
          <div className="absolute top-5 right-5 text-[#0084FF]">
            <HugeiconsIcon icon={CheckmarkBadge01Icon} className="w-5 h-5" />
          </div>
          
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-[#0084FF] flex items-center justify-center text-white">
              <HugeiconsIcon icon={Home01Icon} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-[15px]">{t('step1.hostAccount')}</h3>
                <span className="bg-[#0084FF] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{t('step1.websiteBadge')}</span>
              </div>
              <p className="text-[12px] text-gray-500">{t('step1.hostSubtitle')}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-gray-700 mt-0.5" />
              <span className="text-[13px] text-gray-700">{t('step1.feature1')}</span>
            </div>
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-gray-700 mt-0.5" />
              <span className="text-[13px] text-gray-700">{t('step1.feature2')}</span>
            </div>
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-gray-700 mt-0.5" />
              <span className="text-[13px] text-gray-700">{t('step1.feature3')}</span>
            </div>
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-gray-700 mt-0.5" />
              <span className="text-[13px] text-gray-700">{t('step1.feature4')}</span>
            </div>
          </div>

          <button onClick={() => router.push('/signup/host/step-2')} className="w-full mt-5 bg-[#0084FF] hover:bg-blue-600 text-white rounded-lg h-10 text-[13px] font-medium flex items-center justify-center gap-1 transition-colors">
            {t('step1.continueAsHost')} <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
          </button>
        </div>

        {/* Cleaner Account Card */}
        <div className="border border-gray-200 rounded-xl p-5 bg-[#F8F9FA] relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
              <HugeiconsIcon icon={SmartPhone01Icon} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-700 text-[15px]">{t('step1.cleanerAccount')}</h3>
                <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-medium">{t('step1.appOnlyBadge')}</span>
              </div>
              <p className="text-[12px] text-gray-500">{t('step1.cleanerSubtitle')}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-3 flex items-start gap-2.5 mb-4 shadow-sm">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-gray-500 leading-relaxed">
              <strong className="text-gray-700 font-medium">{t('step1.cleanerNoticeBold')}</strong> {t('step1.cleanerNoticeBefore')} <strong>CleanSpace App</strong> {t('step1.cleanerNoticeAfter')}
            </p>
          </div>

          <button disabled className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-400 rounded-lg h-10 text-[13px] font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <HugeiconsIcon icon={SmartPhone01Icon} className="w-4 h-4" /> {t('step1.availableMobileOnly')}
          </button>
        </div>
      </div>
    </div>
  );
}
