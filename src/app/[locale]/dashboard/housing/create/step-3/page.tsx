'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '../components/StepIndicator';
import { useCreateHousing } from '../CreateHousingContext';
import { Camera01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { AppImage } from '@/components/ui/app-image';

export default function Step3Page() {
  const t = useTranslations('Housing.step3');
  const c = useTranslations('Common');
  const router = useRouter();
  const { data, updateData } = useCreateHousing();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleContinue = () => {
    router.push('/dashboard/housing/create/step-4');
  };

  const handlePick = () => fileInputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateData({ photoFile: file, photo: URL.createObjectURL(file) });
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <StepIndicator currentStep={3} />
      
      <div className="text-center mb-8">
        <h2 className="text-[16px] font-bold text-gray-900 mb-1">{t('heading')}</h2>
        <p className="text-[13px] text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-6">
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <div
          onClick={handlePick}
          className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#0084FF] hover:bg-[#F5F9FF] transition-colors relative overflow-hidden group"
        >
          {data.photo ? (
            <>
              <AppImage src={data.photo} alt="Accommodation" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium text-[13px]">{t('changePhoto')}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
                <HugeiconsIcon icon={Camera01Icon} className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-[13px] font-medium text-gray-600 underline">{t('uploadHere')}</span>
            </div>
          )}
        </div>
        
        <p className="text-[11px] text-gray-500 text-center">
          {t('photoHint')}
        </p>

        <button
          onClick={handleContinue}
          className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          {c('continue')}
        </button>

      </div>
    </div>
  );
}
