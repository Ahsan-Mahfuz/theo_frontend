'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CustomerSupportIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useGetMeQuery } from '@/store/api/authApi';
import { useCreateSupportTicketMutation } from '@/store/api/supportApi';
import { getApiErrorMessage } from '@/lib/apiError';

export default function SupportTab() {
  const t = useTranslations('Settings.support');
  const { data: me } = useGetMeQuery();
  const [createSupportTicket, { isLoading }] = useCreateSupportTicketMutation();

  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (me?.email) setEmail(me.email);
  }, [me?.email]);

  const handleSend = async () => {
    setError('');
    setSuccess('');
    try {
      await createSupportTicket({ subject, email, message }).unwrap();
      setSuccess(t('sentSuccess'));
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300 w-full max-w-2xl mx-auto items-center mt-6">
      
      {/* Top Header Section */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="w-[60px] h-[60px] rounded-full bg-[#F5F9FF] flex items-center justify-center mb-5">
          <HugeiconsIcon icon={CustomerSupportIcon} className="w-6 h-6 text-[#0084FF]" />
        </div>
        <h2 className="text-[20px] font-bold text-gray-900 mb-2">{t('title')}</h2>
        <p className="text-[13px] text-gray-500 max-w-[340px] leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        
        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-900">{t('subject')}</label>
          <input
            type="text"
            placeholder={t('subjectPlaceholder')}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-[52px] bg-[#FAFAFA] border border-gray-100 hover:border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-900">{t('email')}</label>
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[52px] bg-[#FAFAFA] border border-gray-100 hover:border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between w-full">
            <label className="text-[12px] font-bold text-gray-900">{t('message')}</label>
            <span className="text-[11px] text-gray-400">{message.length}/1000</span>
          </div>
          <textarea 
            placeholder={t('messagePlaceholder')}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-[160px] resize-none bg-[#FAFAFA] border border-gray-100 hover:border-gray-200 rounded-xl p-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
          ></textarea>
        </div>

        {error && <p className="text-[13px] text-red-500">{error}</p>}
        {success && <p className="text-[13px] text-green-600">{success}</p>}

        {/* Submit Button */}
        <button
          onClick={handleSend}
          disabled={isLoading || !subject || !email || !message}
          className="w-full h-[52px] bg-[#0084FF] hover:bg-[#0073E6] text-white font-medium rounded-xl mt-2 transition-colors shadow-sm shadow-blue-200 disabled:opacity-60"
        >
          {isLoading ? t('sending') : t('sendMessage')}
        </button>

      </div>

    </div>
  );
}
