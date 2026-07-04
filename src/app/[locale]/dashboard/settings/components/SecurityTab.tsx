'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LockedIcon, ChevronRightIcon, ArrowLeft02Icon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useGetMeQuery, useUpdateMeMutation, useChangePasswordMutation, useDeleteMyAccountMutation } from '@/store/api/authApi';
import { getApiErrorMessage } from '@/lib/apiError';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';

export default function SecurityTab() {
  const t = useTranslations('Settings.security');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: me } = useGetMeQuery();

  const [view, setView] = useState<'main' | 'change-password' | 'recovery-email' | 'recovery-phone' | 'delete-account'>('main');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Change password
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Recovery phone / update profile
  const [updateMe, { isLoading: isUpdatingPhone }] = useUpdateMeMutation();
  const [phone, setPhone] = useState('');

  // Delete account
  const [deleteMyAccount, { isLoading: isDeleting }] = useDeleteMyAccountMutation();
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (me?.phone) setPhone(me.phone);
  }, [me?.phone]);

  const goMain = () => {
    setError('');
    setSuccess('');
    setView('main');
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword }).unwrap();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(t('passwordUpdatedSuccess'));
      setView('main');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleUpdatePhone = async () => {
    setError('');
    setSuccess('');
    try {
      const fd = new FormData();
      fd.append('phone', phone);
      await updateMe(fd).unwrap();
      setSuccess(t('recoveryPhoneUpdated'));
      setView('main');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    try {
      await deleteMyAccount({ password: deletePassword }).unwrap();
      dispatch(logout());
      router.push('/login');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (view === 'change-password') {
    return (
      <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-2xl mx-auto mt-2">
        
        <button
          onClick={goMain}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-8 group"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium">{t('backToSecurity')}</span>
        </button>

        <h2 className="text-[24px] font-bold text-gray-900 mb-2">{t('changePasswordTitle')}</h2>
        <p className="text-[14px] text-gray-500 mb-8">
          {t('changePasswordSubtitle')}
        </p>

        <div className="flex flex-col gap-5 w-full">
          
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('currentPassword')}</label>
            <div className="relative flex items-center">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder={t('currentPasswordPlaceholder')}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
              />
              <button 
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HugeiconsIcon icon={showCurrentPassword ? ViewOffIcon : ViewIcon} className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 my-2"></div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('newPassword')}</label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder={t('newPasswordPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
              />
              <button 
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HugeiconsIcon icon={showNewPassword ? ViewOffIcon : ViewIcon} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('confirmNewPassword')}</label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t('confirmNewPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
              />
              <button 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HugeiconsIcon icon={showConfirmPassword ? ViewOffIcon : ViewIcon} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          {/* Save Button */}
          <button
            onClick={handleChangePassword}
            disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="w-full h-[52px] bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl mt-4 transition-colors disabled:opacity-60"
          >
            {isChangingPassword ? t('updating') : t('updatePassword')}
          </button>

        </div>
      </div>
    );
  }

  if (view === 'recovery-email') {
    return (
      <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-2xl mx-auto mt-2">
        <button onClick={goMain} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-8 group">
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium">{t('backToSecurity')}</span>
        </button>
        <h2 className="text-[24px] font-bold text-gray-900 mb-2">{t('recoveryEmailTitle')}</h2>
        <p className="text-[14px] text-gray-500 mb-8">{t('recoveryEmailSubtitle')}</p>
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('newRecoveryEmail')}</label>
            <input type="email" disabled placeholder={t('newRecoveryEmailPlaceholder')} className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors" />
          </div>
          <p className="text-[13px] text-gray-500 bg-[#FAFAFA] border border-gray-100 rounded-xl px-4 py-3">{t('comingSoon')}</p>
          <button disabled className="w-full h-[52px] bg-gray-900 text-white font-medium rounded-xl mt-4 transition-colors opacity-50 cursor-not-allowed">
            {t('updateEmail')}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'recovery-phone') {
    return (
      <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-2xl mx-auto mt-2">
        <button onClick={goMain} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-8 group">
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium">{t('backToSecurity')}</span>
        </button>
        <h2 className="text-[24px] font-bold text-gray-900 mb-2">{t('recoveryPhoneTitle')}</h2>
        <p className="text-[14px] text-gray-500 mb-8">{t('recoveryPhoneSubtitle')}</p>
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('newPhoneNumber')}</label>
            <input
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
            />
          </div>
          {error && <p className="text-[13px] text-red-500">{error}</p>}
          <button
            onClick={handleUpdatePhone}
            disabled={isUpdatingPhone || !phone}
            className="w-full h-[52px] bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl mt-4 transition-colors disabled:opacity-60"
          >
            {isUpdatingPhone ? t('updating') : t('updatePhoneNumber')}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'delete-account') {
    const canDelete = deleteConfirm === 'DELETE' && deletePassword.length > 0;
    return (
      <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-2xl mx-auto mt-2">
        <button onClick={goMain} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-8 group">
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium">{t('backToSecurity')}</span>
        </button>
        <h2 className="text-[24px] font-bold text-red-600 mb-2">{t('deleteAccountTitle')}</h2>
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[14px] leading-relaxed mb-6 border border-red-100">
          <strong>{t('warningLabel')}</strong> {t('deleteWarning')}
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('typeDeleteToConfirm')}</label>
            <input
              type="text"
              placeholder="DELETE"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full h-[52px] bg-[#FAFAFA] border border-red-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">{t('confirmYourPassword')}</label>
            <input
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full h-[52px] bg-[#FAFAFA] border border-red-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
            />
          </div>
          {error && <p className="text-[13px] text-red-500">{error}</p>}
          <button
            onClick={handleDeleteAccount}
            disabled={!canDelete || isDeleting}
            className="w-full h-[52px] bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl mt-4 transition-colors shadow-sm shadow-red-200 disabled:opacity-60"
          >
            {isDeleting ? t('deleting') : t('permanentlyDeleteAccount')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300 w-full max-w-2xl mx-auto items-center mt-6">
      
      {/* Top Header Section */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="w-[60px] h-[60px] rounded-full bg-[#F5F9FF] flex items-center justify-center mb-5">
          <HugeiconsIcon icon={LockedIcon} className="w-6 h-6 text-[#0084FF]" />
        </div>
        <h2 className="text-[20px] font-bold text-gray-900 mb-2">{t('accountSecureTitle')}</h2>
        <p className="text-[13px] text-gray-500 max-w-[300px] leading-relaxed">
          {t('accountSecureSubtitle')}
        </p>
        {success && <p className="text-[13px] text-green-600 mt-3">{success}</p>}
      </div>

      <div className="w-full flex flex-col gap-8">
        
        {/* Change Password Section */}
        <div className="flex flex-col w-full">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">{t('changePasswordSectionLabel')}</h3>
          <button 
            onClick={() => setView('change-password')}
            className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
          >
            <div className="flex flex-col">
              <span className="text-[14px] text-gray-900 font-medium mb-0.5">{t('changePasswordCardTitle')}</span>
              <span className="text-[12px] text-gray-400">{t('changePasswordCardSubtitle')}</span>
            </div>
            <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
          </button>
        </div>

        {/* Change Recovery Section — DISABLED: backend has no recovery email/phone API */}
        {/*
        <div className="flex flex-col w-full">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">CHANGE RECOVERY</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setView('recovery-email')}
              className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
            >
              <div className="flex flex-col">
                <span className="text-[14px] text-gray-900 font-medium mb-0.5">Recovery email</span>
                <span className="text-[12px] text-gray-400">{me?.email || 'ann.smith@example.com'}</span>
              </div>
              <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
            <button
              onClick={() => setView('recovery-phone')}
              className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
            >
              <div className="flex flex-col">
                <span className="text-[14px] text-gray-900 font-medium mb-0.5">Recovery phone</span>
                <span className="text-[12px] text-gray-400">{me?.phone || '+33 6 12 34 56 78'}</span>
              </div>
              <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          </div>
        </div>
        */}

        {/* Delete Account Section */}
        <div className="flex flex-col w-full mt-2">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">{t('deleteAccountSectionLabel')}</h3>
          <button 
            onClick={() => setView('delete-account')}
            className="w-full bg-[#FFF5F5] border border-transparent hover:border-red-100 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
          >
            <div className="flex flex-col">
              <span className="text-[14px] text-red-500 font-medium mb-0.5">{t('deleteMyAccount')}</span>
              <span className="text-[12px] text-red-400/80">{t('deleteMyAccountSubtitle')}</span>
            </div>
            <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-red-300 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

      </div>

    </div>
  );
}
