'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSignupContext } from '../SignupContext';
import { useSignupMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setPendingSignup } from '@/store/authSlice';
import { getApiErrorMessage } from '@/lib/apiError';
import { useTranslations } from 'next-intl';

export default function Step2Page() {
  const router = useRouter();
  const t = useTranslations('Signup');
  const c = useTranslations('Common');
  const dispatch = useAppDispatch();
  const { data, updateData } = useSignupContext();
  const [signup, { isLoading }] = useSignupMutation();
  const [error, setError] = React.useState('');

  const handleContinue = async () => {
    const email = data.email.trim().toLowerCase();
    if (!email) return;
    setError('');
    try {
      await signup({ email }).unwrap();
      dispatch(setPendingSignup({ email }));
      router.push('/signup/host/step-3');
    } catch (err) {
      setError(getApiErrorMessage(err, t('step2.errorSendCode')));
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 w-full mb-8">
        <h2 className="text-[22px] text-gray-900 font-semibold">{t('step2.heading')}</h2>
        <p className="text-[13px] text-gray-500">
          {t('step2.subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col gap-1.5 mb-6">
        <label className="text-[13px] text-gray-600 font-medium">{t('step2.emailLabel')}</label>
        <div className="flex items-center w-full bg-[#F8F9FA] border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
          <HugeiconsIcon icon={Mail01Icon} className="text-gray-400 w-4 h-4" />
          <input 
            type="email" 
            placeholder={t('step2.emailPlaceholder')}
            className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full" 
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            required 
          />
        </div>
      </div>

      {error && (
        <p className="w-full text-[12px] text-red-500 mb-3 -mt-3">{error}</p>
      )}

      <button
        onClick={handleContinue}
        disabled={isLoading || !data.email}
        className={`w-full h-11 rounded-lg text-white transition-colors font-medium text-[14px] ${isLoading || !data.email ? 'bg-[#0084FF]/50 cursor-not-allowed' : 'bg-[#0084FF] hover:bg-blue-600'}`}
      >
        {isLoading ? t('step2.sendingCode') : c('continue')}
      </button>

      <p className="text-gray-500 text-[13px] mt-6">
        {t('step2.haveAccount')} <Link href="/login" className="text-[#35A9D6] hover:underline">{c('signIn')}</Link>
      </p>
    </div>
  );
}
