'use client';

import React from 'react';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Location01Icon, Calendar01Icon, Time02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { MOCK_ACCOMMODATIONS, MOCK_HOUSEKEEPERS } from '../../add-housekeeper/data';
import { useCompleteScheduleMutation } from '@/store/api/scheduleApi';
import { getApiErrorMessage } from '@/lib/apiError';

export default function CompletedTaskPage() {
  const router = useRouter();
  const t = useTranslations('Tasks');
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const property = MOCK_ACCOMMODATIONS[0];
  const cleaner = MOCK_HOUSEKEEPERS[0];

  const [completeSchedule, { isLoading }] = useCompleteScheduleMutation();
  const [error, setError] = React.useState('');

  const handleValidate = async () => {
    if (!id) {
      router.push('/dashboard');
      return;
    }
    setError('');
    try {
      await completeSchedule(id).unwrap();
      router.push('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleInvalidate = () => {
    router.push('/dashboard');
  };

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Top Header */}
      <div className="mb-10 flex flex-col">
        <h2 className="text-[32px] font-bold text-gray-900 mb-8">{t('checklistHeader')}</h2>
        
        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Left Column: Selected Property Card */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 w-full lg:w-[400px] shrink-0">
            <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden relative bg-gray-200 shrink-0">
              <AppImage src={property.image} alt={property.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col py-1 flex-1">
               <span className="text-[16px] font-bold text-gray-900 mb-1">{property.name}</span>
               <div className="flex items-center gap-1.5 mb-4">
                 <HugeiconsIcon icon={Location01Icon} className="w-4 h-4 text-gray-400" />
                 <span className="text-[13px] text-gray-500">{t('location')}</span>
               </div>
               
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-1.5">
                   <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-400" />
                   <div className="flex flex-col">
                     <span className="text-[10px] text-gray-500">{t('dateLabel')}</span>
                     <span className="text-[11px] font-medium text-gray-900">{t('dateJune12')}</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <HugeiconsIcon icon={Time02Icon} className="w-4 h-4 text-gray-400" />
                   <div className="flex flex-col">
                     <span className="text-[10px] text-gray-500">{t('timeLabel')}</span>
                     <span className="text-[11px] font-medium text-gray-900">10:00 - 13:00</span>
                   </div>
                 </div>
               </div>

               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden relative">
                     <AppImage src={cleaner.avatar} alt="Cleaner" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[11px] font-bold text-gray-900">{cleaner.name}</span>
                     <span className="text-[10px] text-gray-400">{t('autoAssignedCleaner')}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Photos and Notes */}
          <div className="flex-1 w-full bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden max-w-[500px]">
             
             {/* Header */}
             <div className="w-full h-12 bg-[#FAFAFA] flex items-center justify-center border-b border-gray-100">
                <span className="text-[12px] font-medium text-gray-500">{t('photos')}</span>
             </div>

             <div className="p-4 flex flex-col">
                {/* Photo */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative mb-4 group cursor-pointer">
                   <AppImage src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop" alt="Cleaning Photo" fill className="object-cover" />
                   <button className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors backdrop-blur-sm">
                      <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                   </button>
                </div>

                {/* Notes */}
                <div className="flex items-start gap-2 mb-6">
                   <span className="text-[14px]">📝</span>
                   <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-gray-900 mb-1">{t('notesFromHousekeeper')}</span>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{t('completedNote')}</p>
                   </div>
                </div>

                {/* Buttons */}
                {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
                <div className="flex items-center gap-3">
                   <button
                     onClick={handleInvalidate}
                     disabled={isLoading}
                     className="flex-1 h-11 bg-[#8F939D] text-white text-[13px] font-medium rounded-xl hover:bg-gray-500 transition-colors disabled:opacity-60"
                   >
                     {t('invalidated')}
                   </button>
                   <button
                     onClick={handleValidate}
                     disabled={isLoading}
                     className="flex-1 h-11 bg-[#0084FF] text-white text-[13px] font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-60"
                   >
                     {isLoading ? t('validating') : t('validateCleaning')}
                   </button>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
