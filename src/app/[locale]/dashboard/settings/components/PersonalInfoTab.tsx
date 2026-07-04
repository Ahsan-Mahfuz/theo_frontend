'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { Camera01Icon, Edit02Icon, Tick02Icon, ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useGetMeQuery, useUpdateMeMutation } from '@/store/api/authApi';
import { getApiErrorMessage } from '@/lib/apiError';
import { resolveAssetUrl } from '@/lib/config';

export default function PersonalInfoTab() {
  const t = useTranslations('Settings.personal');
  const c = useTranslations('Common');
  const { data: me } = useGetMeQuery();
  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();

  const [view, setView] = useState<'main' | 'edit-personal' | 'edit-address'>('main');
  const [error, setError] = useState('');

  // Personal info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Address
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Germany');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!me) return;
    setFirstName(me.firstName ?? '');
    setLastName(me.lastName ?? '');
    setEmail(me.email ?? '');
    setPhone(me.phone ?? '');
    setAddress(me.address ?? '');
    setCity(me.city ?? '');
    setZipCode(me.zipCode ?? '');
    setCountry(me.country ?? 'Germany');
  }, [me]);

  const displayName =
    me?.name || [me?.firstName, me?.lastName].filter(Boolean).join(' ') || 'User';
  const avatarSrc =
    resolveAssetUrl(me?.profileImage) ||
    `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(displayName)}`;

  const handleSavePersonal = async () => {
    setError('');
    try {
      const fd = new FormData();
      fd.append('firstName', firstName);
      fd.append('lastName', lastName);
      fd.append('phone', phone);
      await updateMe(fd).unwrap();
      setView('main');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleSaveAddress = async () => {
    setError('');
    try {
      const fd = new FormData();
      fd.append('address', address);
      fd.append('city', city);
      fd.append('zipCode', zipCode);
      fd.append('country', country);
      await updateMe(fd).unwrap();
      setView('main');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const fd = new FormData();
      fd.append('profileImage', file);
      await updateMe(fd).unwrap();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (view === 'edit-personal') {
    return (
      <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-2xl mx-auto mt-2">
        <button
          onClick={() => { setError(''); setView('main'); }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-8 group"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium">{t('backToProfile')}</span>
        </button>

        <h2 className="text-[24px] font-bold text-gray-900 mb-2">{t('editPersonalTitle')}</h2>
        <p className="text-[14px] text-gray-500 mb-8">
          {t('editPersonalSubtitle')}
        </p>

        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">{t('firstName')}</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">{t('lastName')}</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('emailAddress')}</label>
            <input type="email" value={email} disabled className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-500 focus:outline-none transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('phoneNumber')}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors" />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            onClick={handleSavePersonal}
            disabled={isSaving}
            className="w-full h-[52px] bg-[#0084FF] hover:bg-[#0073E6] text-white font-medium rounded-xl mt-4 transition-colors shadow-sm shadow-blue-200 disabled:opacity-60"
          >
            {isSaving ? c('saving') : c('saveChanges')}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'edit-address') {
    return (
      <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-2xl mx-auto mt-2">
        <button
          onClick={() => { setError(''); setView('main'); }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-8 group"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium">{t('backToProfile')}</span>
        </button>

        <h2 className="text-[24px] font-bold text-gray-900 mb-2">{t('editAddressTitle')}</h2>
        <p className="text-[14px] text-gray-500 mb-8">
          {t('editAddressSubtitle')}
        </p>

        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('streetAddress')}</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">{t('city')}</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">{t('zipCode')}</label>
              <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('country')}</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors">
              <option value="Germany">{t('countryGermany')}</option>
              <option value="France">{t('countryFrance')}</option>
              <option value="UK">{t('countryUK')}</option>
              <option value="USA">{t('countryUSA')}</option>
            </select>
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            onClick={handleSaveAddress}
            disabled={isSaving}
            className="w-full h-[52px] bg-[#0084FF] hover:bg-[#0073E6] text-white font-medium rounded-xl mt-4 transition-colors shadow-sm shadow-blue-200 disabled:opacity-60"
          >
            {isSaving ? c('saving') : c('saveChanges')}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300">

      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="relative">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
            <AppImage src={avatarSrc} alt={displayName} fill sizes="72px" className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <HugeiconsIcon icon={Camera01Icon} className="w-3.5 h-3.5 text-[#0084FF]" />
          </button>
        </div>
        <div className="flex flex-col">
          <h2 className="text-[16px] font-bold text-gray-900 mb-1">{displayName}</h2>
          <p className="text-[13px] text-gray-500 leading-relaxed max-w-[320px]">
            {t('profileDescription')}
          </p>
        </div>
      </div>

      {error && <p className="text-[13px] text-red-500 mb-6">{error}</p>}

      {/* Personal Info Section */}
      <div className="flex flex-col mb-10">
        <div className='flex justify-between items-center mb-4'>
          <span onClick={() => setView('edit-personal')} className='flex items-center gap-2'><h3 className="text-[13px] font-bold text-gray-900">{t('personalInfoLabel')}</h3>
          <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer" /></span>
        </div>
        <div className="flex flex-col gap-3">

          <div className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl px-4 py-3 flex items-center justify-between group">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 mb-0.5">{t('firstNameField')}</span>
              <span className="text-[14px] text-gray-900 font-medium">{me?.firstName || '-'}</span>
            </div>

          </div>

          <div  className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl px-4 py-3 flex items-center justify-between group">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 mb-0.5">{t('lastNameField')}</span>
              <span className="text-[14px] text-gray-900 font-medium">{me?.lastName || '-'}</span>
            </div>

          </div>

          <div className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl px-4 py-3 flex items-center justify-between group">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 mb-0.5">{t('emailField')}</span>
              <span className="text-[14px] text-gray-900 font-medium">{me?.email || '-'}</span>
            </div>

          </div>

          <div className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl px-4 py-3 flex items-center justify-between group">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 mb-0.5">{t('phoneField')}</span>
              <span className="text-[14px] text-gray-900 font-medium">{me?.phone || '-'}</span>
            </div>

          </div>

        </div>
      </div>

      {/* Address Section */}
      <div className="flex flex-col mb-10">
        <div className='flex justify-between items-center mb-4'>
          <span onClick={() => setView('edit-address')} className='flex items-center gap-2'><h3 className="text-[13px] font-bold text-gray-900">{t('addressLabel')}</h3>
          <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer" /></span>
        </div>

        <div className="flex flex-col gap-3">

          <div className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl px-4 py-3 flex items-center justify-between group">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 mb-0.5">{t('addressField')}</span>
              <span className="text-[14px] text-gray-900 font-medium">{me?.address || '-'}</span>
            </div>

          </div>

          <div className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl px-4 py-3 flex items-center justify-between group">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 mb-0.5">{t('cityField')}</span>
              <span className="text-[14px] text-gray-900 font-medium">{me?.city || '-'}</span>
            </div>
          </div>

          <div className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl px-4 py-3 flex items-center justify-between group">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 mb-0.5">{t('zipCodeField')}</span>
              <span className="text-[14px] text-gray-900 font-medium">{me?.zipCode || '-'}</span>
            </div>

          </div>

          <div className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl px-4 py-3 flex items-center justify-between group">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 mb-0.5">{t('countryField')}</span>
              <span className="text-[14px] text-gray-900 font-medium">{me?.country || '-'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Security Info Card */}
      <div className="w-full bg-[#F5F9FF] rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5 text-[#0084FF]" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-gray-900 mb-0.5">{t('securityTitle')}</span>
          <span className="text-[11px] text-gray-500 leading-snug">{t('securitySubtitle')}</span>
        </div>
      </div>

    </div>
  );
}
