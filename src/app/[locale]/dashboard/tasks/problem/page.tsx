'use client';

import React from 'react';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { useRouter } from 'next/navigation';
import { Location01Icon, Calendar01Icon, Time02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { MOCK_ACCOMMODATIONS, MOCK_HOUSEKEEPERS } from '../../add-housekeeper/data';

export default function ProblemTaskPage() {
  const router = useRouter();
  const t = useTranslations('Tasks');
  const c = useTranslations('Common');
  const property = MOCK_ACCOMMODATIONS[0];
  const cleaner = MOCK_HOUSEKEEPERS[0];

  return (
    <div className="w-full flex items-center justify-center min-h-[70vh] animate-in fade-in slide-in-from-right-8 duration-500 py-10">
      <div className="w-full max-w-[600px] bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 p-5 flex flex-col items-center">
        
        {/* Badge */}
        <div className="w-14 h-14 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-2">
          <div className="w-8 h-8 bg-[#EF4444] rounded-full flex items-center justify-center">
            <span className="text-white font-serif italic text-[18px] font-bold">i</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-2">{t('problemReportedTitle')}</h2>
        <p className="text-[10px] text-gray-400 text-center mb-6 uppercase tracking-wider">
          {t('reportedOn')}
        </p>

        {/* Details Block */}
        <div className="w-full flex flex-col gap-6">
          
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
                       <span className="text-[10px] font-medium text-gray-900 leading-none">{t('dateMay22')}</span>
                     </div>
                   </div>

                   <div className="flex items-center gap-1.5">
                     <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5 text-gray-400" />
                     <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 leading-none mb-0.5">{t('timeSlotLabel')}</span>
                       <span className="text-[10px] font-medium text-gray-900 leading-none">10:00 - 13:00</span>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Cleaner Block */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full overflow-hidden relative">
                 <AppImage src={cleaner.avatar} alt="Cleaner" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
               </div>
               <div className="flex flex-col">
                 <span className="text-[12px] font-bold text-gray-900">{cleaner.name}</span>
                 <span className="text-[11px] text-gray-500">{t('housekeeper')}</span>
               </div>
             </div>
             <button
               onClick={() => router.push('/dashboard/message')}
               className="px-4 py-1.5 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-lg hover:bg-gray-200 transition-colors"
             >
               {t('message')}
             </button>
          </div>

          {/* Note Box */}
          <div className="w-full bg-[#F3F4F6] rounded-xl p-4">
             <p className="text-[12px] text-gray-600 leading-relaxed">
               {t('problemNote')}
             </p>
          </div>

          {/* Photos */}
          <div className="flex flex-col gap-3">
             <span className="text-[13px] font-bold text-gray-900">{t('photosAddedBy')}</span>
             <div className="grid grid-cols-2 gap-4">
                <div className="w-full aspect-square rounded-2xl overflow-hidden relative bg-gray-200">
                  <AppImage src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop" alt="Broken glass" fill className="object-cover" />
                </div>
                <div className="w-full aspect-square rounded-2xl overflow-hidden relative bg-gray-200">
                  <AppImage src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400&auto=format&fit=crop" alt="Stains" fill className="object-cover" />
                </div>
             </div>
          </div>

          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full h-11 bg-black text-white rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors"
          >
            {c('backToHome')}
          </button>

        </div>
      </div>
    </div>
  );
}
