'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import PersonalInfoTab from './components/PersonalInfoTab';
import AboutUsTab from './components/AboutUsTab';
import TermsTab from './components/TermsTab';
import PrivacyTab from './components/PrivacyTab';
import LegalTab from './components/LegalTab';
import SecurityTab from './components/SecurityTab';
import LanguageTab from './components/LanguageTab';
import SupportTab from './components/SupportTab';
// import PaymentMethodTab from './components/PaymentMethodTab'; // Payment Method section disabled
import PastCleaningTab from './components/PastCleaningTab';
import {
  UserIcon,
  LockedIcon,
  GlobalIcon, 
  CustomerSupportIcon,
  InformationCircleIcon,
  ChevronRightIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// For icon fallback: The screenshot uses some specific icons, we'll try to match them closely with core-free-icons.
// Past Cleaning -> Tick02Icon / CleanIcon doesn't exist so we use a generic task/tick icon or just stick to generic. 
// I will use some safe generic ones from hugeicons.

const PastCleaningIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17.5 2.5L10.8333 9.58333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.87144 9.23783C5.80449 10.0307 4.15224 9.89466 2.5 9.24041C2.91716 14.6092 5.42012 16.6741 8.75742 17.5C8.75742 17.5 11.2718 15.722 11.6342 11.5062C11.6734 11.0496 11.6931 10.8213 11.5982 10.5641C11.5032 10.3068 11.3168 10.1223 10.9441 9.75333C10.3311 9.14641 10.0246 8.84299 9.66075 8.76699C9.297 8.69108 8.82183 8.87333 7.87144 9.23783Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.75 13.7053C3.75 13.7053 5.83333 14.1072 7.91667 12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.08333 6.04167C7.08333 6.61697 6.61697 7.08333 6.04167 7.08333C5.46637 7.08333 5 6.61697 5 6.04167C5 5.46637 5.46637 5 6.04167 5C6.61697 5 7.08333 5.46637 7.08333 6.04167Z" stroke="currentColor"/>
    <path d="M9.27081 3.33333H9.16665M9.37498 3.33333C9.37498 3.44839 9.28173 3.54167 9.16665 3.54167C9.05156 3.54167 8.95831 3.44839 8.95831 3.33333C8.95831 3.21828 9.05156 3.125 9.16665 3.125C9.28173 3.125 9.37498 3.21828 9.37498 3.33333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TermsIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12.5 2.08301V3.33301C12.5 4.51152 12.5 5.10077 12.8661 5.46689C13.2322 5.83301 13.8215 5.83301 15 5.83301H16.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.33331 13.3337V6.66699C3.33331 4.30997 3.33331 3.13146 4.06555 2.39923C4.79778 1.66699 5.97629 1.66699 8.33331 1.66699H11.8096C12.1502 1.66699 12.3206 1.66699 12.4737 1.73043C12.6268 1.79386 12.7473 1.91429 12.9881 2.15515L16.1785 5.3455C16.4193 5.58636 16.5398 5.70679 16.6032 5.85993C16.6666 6.01308 16.6666 6.18339 16.6666 6.52402V13.3337C16.6666 15.6907 16.6666 16.8692 15.9344 17.6014C15.2021 18.3337 14.0236 18.3337 11.6666 18.3337H8.33331C5.97629 18.3337 4.79778 18.3337 4.06555 17.6014C3.33331 16.8692 3.33331 15.6907 3.33331 13.3337Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66669 9.16699H13.3334M6.66669 11.667H13.3334M6.66669 14.167H10.1424" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PrivacyIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M15.5907 2.91311C14.0137 2.12851 12.0841 1.66699 10 1.66699C7.91592 1.66699 5.98625 2.12851 4.4093 2.91311C3.63598 3.29788 3.24932 3.49026 2.87467 4.09514C2.5 4.70003 2.5 5.28573 2.5 6.45711V9.36458C2.5 14.1007 6.2853 16.734 8.4775 17.8618C9.08892 18.1764 9.39458 18.3337 10 18.3337C10.6054 18.3337 10.9111 18.1764 11.5224 17.8618C13.7147 16.734 17.5 14.1007 17.5 9.36458V6.45711C17.5 5.28573 17.5 4.70004 17.1253 4.09514C16.7507 3.49025 16.364 3.29788 15.5907 2.91311Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.5 9.58366C7.5 9.58366 8.67325 9.79358 9.16667 11.2503C9.16667 11.2503 10.4167 8.75033 12.5 7.91699" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

const LegalIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M9.58331 2.91699H8.74998C5.60728 2.91699 4.03594 2.91699 3.05962 3.8933C2.08331 4.86962 2.08331 6.44096 2.08331 9.58366V11.2503C2.08331 14.393 2.08331 15.9644 3.05962 16.9407C4.03594 17.917 5.60728 17.917 8.74998 17.917H10.4166C13.5593 17.917 15.1307 17.917 16.107 16.9407C17.0833 15.9644 17.0833 14.393 17.0833 11.2503V10.417" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17.9166 4.99967C17.9166 6.61051 16.6108 7.91634 15 7.91634C13.3891 7.91634 12.0833 6.61051 12.0833 4.99967C12.0833 3.38884 13.3891 2.08301 15 2.08301C16.6108 2.08301 17.9166 3.38884 17.9166 4.99967Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.25 10.417H9.58333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.25 13.75H12.9167" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

const ACCOUNT_SETTINGS_MENU = [
  { id: 'personal-info', labelKey: 'personalInformation', icon: UserIcon },
  { id: 'past-cleaning', labelKey: 'myPastCleaning', customIcon: PastCleaningIcon },
  // Payment Method disabled: the backend has no bank-card CRUD API — Stripe manages
  // cards server-side, so there is nothing to persist from this screen.
  // { id: 'payment-method', labelKey: 'paymentMethod', icon: Wallet01Icon },
  { id: 'security', labelKey: 'passwordAndSecurity', icon: LockedIcon },
  { id: 'language', labelKey: 'language', icon: GlobalIcon },
  { id: 'support', labelKey: 'helpAndSupport', icon: CustomerSupportIcon },
];

const LEGAL_INFORMATION_MENU = [
  { id: 'about-us', labelKey: 'aboutUs', icon: InformationCircleIcon },
  { id: 'terms', labelKey: 'termsOfUse', customIcon: TermsIcon },
  { id: 'privacy', labelKey: 'privacyPolicy', customIcon: PrivacyIcon },
  { id: 'legal', labelKey: 'legalNotice', customIcon: LegalIcon },
];

const VALID_TABS = [
  ...ACCOUNT_SETTINGS_MENU.map((m) => m.id),
  ...LEGAL_INFORMATION_MENU.map((m) => m.id),
];

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const tMenu = useTranslations('Settings.menu');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('personal-info');

  // Open the tab requested via ?tab= (e.g. footer legal links), when valid.
  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 max-w-[1440px] mx-auto">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[32px] font-bold text-gray-900">{t('header')}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col">
          
          <div className="flex flex-col mb-8">
            <span className="text-[12px] font-bold text-[#4B443B] uppercase tracking-wider mb-4 px-2">{tMenu('accountSettings')}</span>
            <div className="flex flex-col gap-1">
              {ACCOUNT_SETTINGS_MENU.map((item) => {
                const CustomIcon = (item as any).customIcon;
                return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full h-14 flex items-center justify-between px-4 rounded-2xl transition-colors ${activeTab === item.id ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-4">
                    {CustomIcon ? (
                      <CustomIcon className={`w-5 h-5 ${activeTab === item.id ? 'text-gray-900' : 'text-gray-500'}`} />
                    ) : (
                      <HugeiconsIcon icon={item.icon as any} className={`w-5 h-5 ${activeTab === item.id ? 'text-gray-900' : 'text-gray-500'}`} />
                    )}
                    <span className={`text-[14px] ${activeTab === item.id ? 'font-medium text-gray-900' : 'text-gray-500'}`}>{tMenu(item.labelKey)}</span>
                  </div>
                  <HugeiconsIcon icon={ChevronRightIcon} className="w-4 h-4 text-gray-300" />
                </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#4B443B] uppercase tracking-wider mb-4 px-2">{tMenu('legalInformation')}</span>
            <div className="flex flex-col gap-1">
              {LEGAL_INFORMATION_MENU.map((item) => {
                const CustomIcon = (item as any).customIcon;
                return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full h-14 flex items-center justify-between px-4 rounded-2xl transition-colors ${activeTab === item.id ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-4">
                    {CustomIcon ? (
                      <CustomIcon className={`w-5 h-5 ${activeTab === item.id ? 'text-gray-900' : 'text-gray-500'}`} />
                    ) : (
                      <HugeiconsIcon icon={item.icon as any} className={`w-5 h-5 ${activeTab === item.id ? 'text-gray-900' : 'text-gray-500'}`} />
                    )}
                    <span className={`text-[14px] ${activeTab === item.id ? 'font-medium text-gray-900' : 'text-gray-500'}`}>{tMenu(item.labelKey)}</span>
                  </div>
                  <HugeiconsIcon icon={ChevronRightIcon} className="w-4 h-4 text-gray-300" />
                </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Main Content */}
        <div className="flex-1 w-full bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] min-h-[600px]">
          
          {activeTab === 'personal-info' ? (
            <PersonalInfoTab />
          ) : activeTab === 'past-cleaning' ? (
            <PastCleaningTab />
          ) : /* Payment Method section disabled — no backend card API
          activeTab === 'payment-method' ? (
            <PaymentMethodTab />
          ) : */ activeTab === 'security' ? (
            <SecurityTab />
          ) : activeTab === 'language' ? (
            <LanguageTab />
          ) : activeTab === 'support' ? (
            <SupportTab />
          ) : activeTab === 'about-us' ? (
            <AboutUsTab />
          ) : activeTab === 'terms' ? (
            <TermsTab />
          ) : activeTab === 'privacy' ? (
            <PrivacyTab />
          ) : activeTab === 'legal' ? (
            <LegalTab />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 animate-in fade-in duration-300">
              <HugeiconsIcon icon={InformationCircleIcon} className="w-12 h-12 text-gray-200 mb-4" />
              <span className="text-[15px] font-medium text-gray-500">{t('underConstruction.content', { tab: activeTab })}</span>
              <span className="text-[13px] text-gray-400 mt-1">{t('underConstruction.subtitle')}</span>
            </div>
          )}

        </div>

      </div>

    </main>
  );
}
