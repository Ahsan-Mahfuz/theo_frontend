'use client';

import { LockedIcon, Mail01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { AppImage } from '@/components/ui/app-image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSigninMutation } from '@/store/api/authApi';
import { getApiErrorMessage } from '@/lib/apiError';

export default function LoginScreen() {
  const t = useTranslations('Auth');
  const c = useTranslations('Common');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signin, { isLoading }] = useSigninMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { user } = await signin({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();
      // Cleaners are app-only; keep the website host-only.
      if (user.role === 'cleaner') {
        setError(t('login.cleanerNotAllowed'));
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, t('login.invalidCredentials')));
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FAFAFA] items-center justify-center font-sans px-4">
      <form className="w-full max-w-[400px] flex flex-col items-center justify-center" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
          <AppImage src="/brand-logo.svg" alt="Logo" width={160} height={60} className="mb-2" />
          <h2 className="text-[22px] text-gray-900 font-semibold">{t('login.welcome')}</h2>
          <p className="text-[14px] text-gray-500 leading-snug">
            {t('login.subtitleLine1')}<br />{t('login.subtitleLine2')}
          </p>
        </div>

        <div className="w-full flex flex-col gap-1.5 mb-4">
          <label className="text-[13px] text-gray-600 font-medium">{c('email')}</label>
          <div className="flex items-center w-full bg-[#F5F6F8] border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
            <HugeiconsIcon icon={Mail01Icon} className="text-gray-400 w-4 h-4" />
            <input type="email" placeholder={t('login.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full" required />
          </div>
        </div>

        <div className="w-full flex flex-col gap-1.5 mb-4">
          <label className="text-[13px] text-gray-600 font-medium">{c('password')}</label>
          <div className="flex items-center w-full bg-[#F5F6F8] border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
            <HugeiconsIcon icon={LockedIcon} className="text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full"
              required
            />
            <HugeiconsIcon 
              icon={ViewIcon} 
              className="text-gray-400 w-4 h-4 cursor-pointer" 
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <input className="w-3.5 h-3.5 rounded border-gray-300 text-[#0084FF] focus:ring-[#0084FF] bg-transparent" type="checkbox" id="checkbox" />
            <label className="text-[13px] text-gray-600" htmlFor="checkbox">{t('login.rememberMe')}</label>
          </div>
          <Link className="text-[13px] text-[#35A9D6] hover:underline" href="/forgot-password">{t('login.forgotPassword')}</Link>
        </div>

        {error && (
          <p className="w-full text-[12px] text-red-500 mb-3 -mt-3">{error}</p>
        )}

        <button type="submit" disabled={isLoading} className={`w-full h-11 rounded-lg text-white transition-colors font-medium text-[14px] ${isLoading ? 'bg-[#0084FF]/50 cursor-not-allowed' : 'bg-[#0084FF] hover:bg-blue-600'}`}>
          {isLoading ? t('login.signingIn') : c('continue')}
        </button>

        <div className="w-full flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-[10px] text-gray-800 font-semibold uppercase">{t('login.or')}</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <p className="text-gray-600 text-[13px]">{t('login.noAccount')} <Link className="text-[#35A9D6] hover:underline" href="/signup">{c('signUp')}</Link></p>
      </form>
    </div>
  );
};