'use client';

import { useState, useRef } from 'react';
import { ViewIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} from '@/store/api/authApi';
import { getApiErrorMessage } from '@/lib/apiError';

export default function ForgotPasswordFlow() {
  const t = useTranslations('Auth');
  const c = useTranslations('Common');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [forgotPassword, { isLoading: isSendingEmail }] = useForgotPasswordMutation();
  const [verifyResetOtp, { isLoading: isVerifyingOtp }] = useVerifyResetOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleStep1 = async () => {
    setError('');
    try {
      await forgotPassword({ email }).unwrap();
      setStep(2);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleStep2 = async () => {
    setError('');
    try {
      await verifyResetOtp({ email, otp: code.join('') }).unwrap();
      setStep(3);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleStep3 = async () => {
    setError('');
    try {
      await resetPassword({ email, newPassword: password, confirmPassword }).unwrap();
      window.location.href = '/login';
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const isLengthValid = password.length >= 8;
  const hasUpperAndNumber = /[A-Z]/.test(password) && /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password !== '' && password === confirmPassword;
  const isStep3Valid = isLengthValid && hasUpperAndNumber && hasSpecialChar && passwordsMatch;

  const renderStep1 = () => (
    <div className="w-full max-w-[400px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
        <h2 className="text-[20px] sm:text-[22px] text-gray-800 font-medium">{t('forgot.step1Title')}</h2>
        <p className="text-[13px] text-gray-500">
          {t('forgot.step1Subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col gap-1.5 mb-6">
        <label className="text-[12px] sm:text-[13px] text-gray-800 font-semibold">{t('forgot.emailLabel')}</label>
        <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 focus-within:border-[#0084FF] transition-colors">
          <input
            type="email"
            placeholder={t('forgot.emailPlaceholder')}
            className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
      </div>

      {error && <p className="text-[12px] text-red-500 mb-3 text-center">{error}</p>}

      <button
        onClick={handleStep1}
        disabled={isSendingEmail || !email}
        className="w-full h-11 rounded-lg text-white bg-[#0084FF] hover:bg-blue-600 transition-colors font-medium text-[14px] disabled:opacity-60"
      >
        {isSendingEmail ? t('forgot.sending') : c('continue')}
      </button>
    </div>
  );

  const renderStep2 = () => {
    // Mask email for display: j****@gmail.com
    const maskedEmail = email 
      ? email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
      : 'j****@gmail.com';

    return (
      <div className="w-full max-w-[400px] flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
          <h2 className="text-[20px] sm:text-[22px] text-gray-800 font-medium">{t('forgot.step2Title')}</h2>
          <p className="text-[13px] text-gray-500 flex flex-col items-center">
            <span>{t('forgot.sentCode')}</span>
            <span>{maskedEmail}</span>
          </p>
        </div>

        <div className="w-full flex justify-center gap-2 sm:gap-3 mb-6">
          {code.map((digit, index) => (
            <input 
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text" 
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const newCode = [...code];
                newCode[index] = e.target.value;
                setCode(newCode);
                if (e.target.value !== '' && index < 3) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && digit === '' && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 border border-gray-200 rounded-xl text-center text-lg font-medium outline-none transition-all focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] ${digit ? 'bg-gray-400 text-white border-transparent' : 'bg-white text-gray-800'}`}
            />
          ))}
        </div>

        {error && <p className="text-[12px] text-red-500 mb-3 text-center">{error}</p>}

        <button
          onClick={handleStep2}
          disabled={isVerifyingOtp || code.join('').length < 4}
          className="w-full h-11 rounded-lg text-white bg-[#0084FF] hover:bg-blue-600 transition-colors font-medium text-[14px] disabled:opacity-60"
        >
          {isVerifyingOtp ? t('forgot.verifying') : c('continue')}
        </button>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="w-full max-w-[400px] flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
        <h2 className="text-[20px] sm:text-[22px] text-gray-800 font-medium">{t('forgot.step3Title')}</h2>
      </div>

      <div className="w-full flex flex-col gap-4 mb-6">
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-[12px] sm:text-[13px] text-gray-800 font-semibold">{t('forgot.passwordLabel')}</label>
          <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="********" 
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[20px] tracking-widest w-full h-full" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <HugeiconsIcon 
              icon={ViewIcon} 
              className="text-gray-400 w-4 h-4 cursor-pointer shrink-0" 
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-[12px] sm:text-[13px] text-gray-800 font-semibold">{t('forgot.confirmPasswordLabel')}</label>
          <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********" 
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[20px] tracking-widest w-full h-full" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <HugeiconsIcon 
              icon={ViewIcon} 
              className="text-gray-400 w-4 h-4 cursor-pointer shrink-0" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 mb-8">
        <label className="text-[12px] text-gray-800 font-medium mb-1">{t('forgot.passwordSecurity')}</label>
        <div className="flex items-center gap-2">
          {isLengthValid ? (
            <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-[#0084FF]" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 ml-0.5" />
          )}
          <span className={`text-[12px] ${isLengthValid ? 'text-gray-800' : 'text-gray-500'}`}>{t('forgot.atLeast8')}</span>
        </div>
        <div className="flex items-center gap-2">
          {hasUpperAndNumber ? (
            <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-[#0084FF]" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 ml-0.5" />
          )}
          <span className={`text-[12px] ${hasUpperAndNumber ? 'text-gray-800' : 'text-gray-500'}`}>{t('forgot.upperAndNumber')}</span>
        </div>
        <div className="flex items-center gap-2">
          {hasSpecialChar ? (
            <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-[#0084FF]" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 ml-0.5" />
          )}
          <span className={`text-[12px] ${hasSpecialChar ? 'text-gray-800' : 'text-gray-500'}`}>{t('forgot.specialChar')}</span>
        </div>
        <div className="flex items-center gap-2">
          {passwordsMatch ? (
            <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-[#0084FF]" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 ml-0.5" />
          )}
          <span className={`text-[12px] ${passwordsMatch ? 'text-gray-800' : 'text-gray-500'}`}>{t('forgot.passwordsMatch')}</span>
        </div>
      </div>

      {error && <p className="text-[12px] text-red-500 mb-3 text-center">{error}</p>}

      <button
        onClick={handleStep3}
        disabled={!isStep3Valid || isResetting}
        className={`w-full h-11 rounded-lg text-white transition-colors font-medium text-[14px] ${isStep3Valid && !isResetting ? 'bg-[#0084FF] hover:bg-blue-600' : 'bg-[#0084FF]/50 cursor-not-allowed'}`}
      >
        {isResetting ? t('forgot.saving') : c('continue')}
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#FAFAFA] flex-col items-center justify-center py-8 sm:py-16 px-4 font-sans">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
