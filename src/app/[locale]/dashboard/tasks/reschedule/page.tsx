'use client';

import React from 'react';
import { AppImage } from '@/components/ui/app-image';
import { useRouter } from 'next/navigation';
import { Location01Icon, Calendar01Icon, Time02Icon, CalendarSetting01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { MOCK_ACCOMMODATIONS, MOCK_HOUSEKEEPERS } from '../../add-housekeeper/data';

export default function RescheduleTaskPage() {
  const router = useRouter();
  const t = useTranslations('Tasks');
  const c = useTranslations('Common');
  const property = MOCK_ACCOMMODATIONS[0];
  const cleaner = MOCK_HOUSEKEEPERS[0];

  return (
    <div className="w-full flex items-center justify-center min-h-[70vh] animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="w-full max-w-[600px] bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 p-10 flex flex-col items-center">
        
        {/* Badge */}
        <div className="w-14 h-14 bg-[#FFEDD5] rounded-full flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center">
            <HugeiconsIcon icon={CalendarSetting01Icon} className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-2">{t('rescheduleTitle')}</h2>
        <p className="text-[12px] text-gray-500 text-center max-w-[300px] mb-10">
          {t('rescheduleSubtitle')}
        </p>

        {/* Details Block */}
        <div className="w-full max-w-[400px] flex flex-col gap-6">
          
          <div className="flex flex-col gap-3">
             <span className="text-[13px] font-bold text-gray-900">{t('accommodation')}</span>
             <div className="flex items-center gap-4 bg-white">
                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden relative bg-gray-200 shrink-0">
                  <AppImage src={property.image} alt={property.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-2">
                   <span className="text-[12px] font-bold text-gray-900">{t('propertyName')}</span>

                   <div className="flex items-center gap-1.5">
                     <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400" />
                     <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 leading-none mb-0.5">{t('locationLabel')}</span>
                       <span className="text-[10px] font-medium text-gray-900 leading-none">Paris 11e</span>
                     </div>
                   </div>

                   <div className="flex items-center gap-1.5">
                     <HugeiconsIcon icon={Calendar01Icon} className="w-3.5 h-3.5 text-gray-400" />
                     <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 leading-none mb-0.5">{t('dateLabel')}</span>
                       <span className="text-[10px] font-medium text-gray-900 leading-none line-through">{t('dateMay22')}</span>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          <button
            onClick={() => router.push('/dashboard/planning')}
            className="w-full h-11 bg-[#0084FF] text-white rounded-xl text-[13px] font-medium hover:bg-blue-600 transition-colors mt-4"
          >
            {t('goToPlanning')}
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full h-11 bg-transparent text-gray-700 rounded-xl text-[13px] font-medium hover:bg-gray-50 transition-colors border border-gray-200 mt-2"
          >
            {c('backToHome')}
          </button>

        </div>
      </div>
    </div>
  );
}
