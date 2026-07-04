'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, LockedIcon, ViewIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSignupContext } from '../SignupContext';
import {
  useCompleteProfileMutation,
  useSelectRoleMutation,
  useSigninMutation,
} from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setPendingSignup } from '@/store/authSlice';
import { getApiErrorMessage } from '@/lib/apiError';
import { useTranslations } from 'next-intl';

export default function Step4Page() {
  const router = useRouter();
  const t = useTranslations('Signup');
  const c = useTranslations('Common');
  const dispatch = useAppDispatch();
  const { data, updateData } = useSignupContext();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [completeProfile] = useCompleteProfileMutation();
  const [selectRole] = useSelectRoleMutation();
  const [signin] = useSigninMutation();
  const [submitting, setSubmitting] = useState(false);

  const isLengthValid = data.password.length >= 8;
  const hasUpperAndNumber = /[A-Z]/.test(data.password) && /[0-9]/.test(data.password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.password);
  const isStep4Valid = data.firstName.trim() !== '' && data.lastName.trim() !== '' && isLengthValid && hasUpperAndNumber && hasSpecialChar;

  const handleContinue = async () => {
    if (!isStep4Valid || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      // 1. Set name + password (uses the onboarding token from OTP verify).
      await completeProfile({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        password: data.password,
      }).unwrap();

      // 2. This is the host website → the account is always a host.
      await selectRole({ role: 'host' }).unwrap();

      // 3. Re-issue a role-bearing token so host-only routes are accessible.
      dispatch(setPendingSignup({ password: data.password }));
      await signin({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }).unwrap();

      router.push('/signup/host/step-5');
    } catch (err) {
      setError(getApiErrorMessage(err, t('step4.errorComplete')));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col gap-2 w-full mb-8">
        <h2 className="text-[22px] text-gray-900 font-semibold">{t('step4.heading')}</h2>
        <p className="text-[13px] text-gray-500">
          {t('step4.subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-gray-600 font-medium">{t('step4.firstNameLabel')}</label>
          <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
            <HugeiconsIcon icon={UserIcon} className="text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={t('step4.firstNamePlaceholder')}
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-gray-600 font-medium">{t('step4.lastNameLabel')}</label>
          <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
            <HugeiconsIcon icon={UserIcon} className="text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={t('step4.lastNamePlaceholder')}
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-gray-600 font-medium">{t('step4.passwordLabel')}</label>
          <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
            <HugeiconsIcon icon={LockedIcon} className="text-gray-400 w-4 h-4" />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder={t('step4.passwordPlaceholder')}
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full"
              value={data.password}
              onChange={(e) => updateData({ password: e.target.value })}
            />
            <HugeiconsIcon 
              icon={ViewIcon} 
              className="text-gray-400 w-4 h-4 cursor-pointer" 
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 mb-8">
        <label className="text-[12px] text-gray-800 font-medium mb-1">{t('step4.passwordSecurity')}</label>
        <div className="flex items-center gap-2">
          {isLengthValid ? (
            <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-[#0084FF]" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 ml-0.5" />
          )}
          <span className={`text-[12px] ${isLengthValid ? 'text-gray-800' : 'text-gray-500'}`}>{t('step4.rule1')}</span>
        </div>
        <div className="flex items-center gap-2">
          {hasUpperAndNumber ? (
            <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-[#0084FF]" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 ml-0.5" />
          )}
          <span className={`text-[12px] ${hasUpperAndNumber ? 'text-gray-800' : 'text-gray-500'}`}>{t('step4.rule2')}</span>
        </div>
        <div className="flex items-center gap-2">
          {hasSpecialChar ? (
            <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-[#0084FF]" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 ml-0.5" />
          )}
          <span className={`text-[12px] ${hasSpecialChar ? 'text-gray-800' : 'text-gray-500'}`}>{t('step4.rule3')}</span>
        </div>
      </div>
    
      {error && (
        <p className="w-full text-[12px] text-red-500 mb-3 -mt-4">{error}</p>
      )}

      <button
        onClick={handleContinue}
        disabled={!isStep4Valid || submitting}
        className={`w-full h-11 rounded-lg text-white transition-colors font-medium text-[14px] ${isStep4Valid && !submitting ? 'bg-[#0084FF] hover:bg-blue-600' : 'bg-[#0084FF]/50 cursor-not-allowed'}`}
      >
        {submitting ? t('step4.creatingAccount') : c('continue')}
      </button>
    </div>
  );
}
