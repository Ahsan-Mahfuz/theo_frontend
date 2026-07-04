'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSignupContext } from '../SignupContext';
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from '@/store/api/authApi';
import { getApiErrorMessage } from '@/lib/apiError';
import { useTranslations } from 'next-intl';

export default function Step3Page() {
  const router = useRouter();
  const t = useTranslations('Signup');
  const c = useTranslations('Common');
  const { data, updateData } = useSignupContext();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [error, setError] = useState('');
  const [resentAt, setResentAt] = useState<number | null>(null);

  const email = data.email.trim().toLowerCase();
  const otp = data.code.join('');

  const handleContinue = async () => {
    if (otp.length !== data.code.length) {
      setError(t('step3.errorFullCode'));
      return;
    }
    setError('');
    try {
      await verifyOtp({ email, otp }).unwrap();
      router.push('/signup/host/step-4');
    } catch (err) {
      setError(getApiErrorMessage(err, t('step3.errorInvalidCode')));
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await resendOtp({ email }).unwrap();
      updateData({ code: data.code.map(() => '') });
      setResentAt(Date.now());
    } catch (err) {
      setError(getApiErrorMessage(err, t('step3.errorResend')));
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col gap-2 w-full mb-8">
        <h2 className="text-[22px] text-gray-900 font-semibold">{t('step3.heading')}</h2>
        <p className="text-[13px] text-gray-500">
          {t('step3.weSentCodeTo')} <span className="font-medium text-gray-800">{data.email || t('step3.yourEmailFallback')}</span>
        </p>
      </div>

      <div className="w-full flex flex-col gap-1.5 mb-6">
        <label className="text-[13px] text-gray-600 font-medium">{t('step3.emailLabel')}</label>
        <div className="flex items-center justify-between w-full bg-white border border-gray-200 h-11 rounded-lg px-3">
          <div className="flex items-center gap-2">
             <HugeiconsIcon icon={Mail01Icon} className="text-gray-400 w-4 h-4" />
             <span className="text-[13px] text-gray-800">{data.email || t('step3.yourEmailFallback')}</span>
          </div>
          <button onClick={() => router.push('/signup/host/step-2')} className="text-[12px] text-[#35A9D6] hover:underline">{t('step3.modify')}</button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-1.5 mb-8">
        <label className="text-[13px] text-gray-600 font-medium">{t('step3.typeCodeLabel')}</label>
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {data.code.map((digit, index) => (
            <input 
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text" 
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const newCode = [...data.code];
                newCode[index] = e.target.value;
                updateData({ code: newCode });
                if (e.target.value !== '' && index < data.code.length - 1) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && digit === '' && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-xl text-center text-xl sm:text-2xl font-semibold text-gray-800 focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] outline-none transition-all"
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="w-full text-[12px] text-red-500 mb-3 text-center">{error}</p>
      )}
      {resentAt && !error && (
        <p className="w-full text-[12px] text-green-600 mb-3 text-center">{t('step3.newCodeSent')}</p>
      )}

      <button
        onClick={handleContinue}
        disabled={isLoading || otp.length !== data.code.length}
        className={`w-full h-11 rounded-lg text-white transition-colors font-medium text-[14px] ${isLoading || otp.length !== data.code.length ? 'bg-[#0084FF]/50 cursor-not-allowed' : 'bg-[#0084FF] hover:bg-blue-600'}`}
      >
        {isLoading ? t('step3.verifying') : c('continue')}
      </button>

      <button
        onClick={handleResend}
        disabled={isResending}
        className="text-gray-500 text-[12px] mt-6 hover:text-gray-800 disabled:opacity-50"
      >
        {isResending ? t('step3.resending') : t('step3.resendCode')}
      </button>
    </div>
  );
}
