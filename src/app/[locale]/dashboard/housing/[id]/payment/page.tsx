'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Calendar01Icon,
  Clock01Icon,
  UserCircleIcon,
  Location01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useGetAccommodationByIdQuery } from '@/store/api/accommodationApi';
import { usePayForScheduleMutation, type PayIntent } from '@/store/api/paymentApi';
import { resolveAssetUrl } from '@/lib/config';
import { getApiErrorMessage } from '@/lib/apiError';
import { AppImage } from '@/components/ui/app-image';

const avatarFor = (name: string) =>
  `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'H')}`;
const cleanerName = (c: any) => c?.name || `${c?.firstName ?? ''} ${c?.lastName ?? ''}`.trim();

// Cache one Stripe.js instance per publishable key (loadStripe is a singleton
// per key, so this survives re-renders without reloading the script).
const stripeCache = new Map<string, Promise<Stripe | null>>();
const stripeFor = (pk: string) => {
  if (!stripeCache.has(pk)) stripeCache.set(pk, loadStripe(pk));
  return stripeCache.get(pk)!;
};

// ─── The Stripe-powered checkout (Card + wallets via Payment Element) ──────────
function CheckoutForm({ returnUrl }: { returnUrl: string }) {
  const t = useTranslations('Housing.payment');
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError('');
    // On success Stripe redirects the browser to return_url; on error we stay.
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });
    if (stripeError) {
      setError(stripeError.message || t('payFailed'));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && <p className="text-[12px] text-red-600 mt-4">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full h-12 bg-[#007AFF] text-white text-[13px] font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-60 mt-6"
      >
        {submitting ? t('processing') : t('confirmPay')}
      </button>

      <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">{t('escrowNote')}</p>
    </form>
  );
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const locale = useLocale();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('scheduleId') || '';
  const t = useTranslations('Housing.payment');

  const { data: accommodation } = useGetAccommodationByIdQuery(id);
  const [payForSchedule] = usePayForScheduleMutation();

  const [intent, setIntent] = useState<PayIntent | null>(null);
  const [initError, setInitError] = useState('');

  // Create (or reuse) the PaymentIntent for this accepted schedule on mount.
  useEffect(() => {
    if (!scheduleId) return;
    let active = true;
    (async () => {
      try {
        const res = await payForSchedule(scheduleId).unwrap();
        if (active) setIntent(res);
      } catch (err) {
        if (active) setInitError(getApiErrorMessage(err));
      }
    })();
    return () => { active = false; };
  }, [scheduleId, payForSchedule]);

  const stripePromise = useMemo(
    () => (intent?.publishableKey ? stripeFor(intent.publishableKey) : null),
    [intent?.publishableKey],
  );

  const cleaners = (accommodation?.assignedCleaners ?? []) as any[];
  const primaryEntry = cleaners.find((c) => c.role === 'primary') || null;
  const housekeeperName = (primaryEntry && cleanerName(primaryEntry.cleaner)) || t('housekeeper');

  const coverImage = resolveAssetUrl(accommodation?.photos?.[0]) || avatarFor(accommodation?.name || 'H');
  const address = accommodation ? `${accommodation.address}, ${accommodation.city}` : '';
  // Real amount charged to the host, from the PaymentIntent (in cents).
  const total = intent ? intent.amount / 100 : accommodation?.cleaningRate ?? null;

  // Absolute URL Stripe redirects to after a successful confirmation.
  const returnUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${locale}/dashboard/housing/${id}/payment/success`
      : '';

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 max-w-[600px] mx-auto">
      <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-8 lg:p-12 flex flex-col">

        {/* Accommodation header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-[80px] h-[80px] rounded-[16px] overflow-hidden relative shrink-0">
            <AppImage src={coverImage} alt={accommodation?.name || ''} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('accommodation')}</span>
            <span className="text-[13px] font-bold text-gray-900">{accommodation?.name}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-500 max-w-[200px] leading-tight">{address}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-400" />
              <span className="text-[12px] text-gray-500">{t('date')}</span>
            </div>
            <span className="text-[12px] font-medium text-gray-900">{t('dateValue')}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4 text-gray-400" />
              <span className="text-[12px] text-gray-500">{t('checkOutIn')}</span>
            </div>
            <span className="text-[12px] font-medium text-gray-900">10:00am → 12:30pm</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={UserCircleIcon} className="w-4 h-4 text-gray-400" />
              <span className="text-[12px] text-gray-500">{t('housekeeper')}</span>
            </div>
            <span className="text-[12px] font-medium text-gray-900">{housekeeperName}</span>
          </div>
        </div>

        {/* Price */}
        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('priceDetails')}</h2>
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex items-center justify-between text-[12px] pb-4 border-b border-gray-100">
            <span className="text-gray-500">{t('cleaningService')}</span>
            <span className="font-medium text-gray-900">{total != null ? `${total},00 €` : '—'}</span>
          </div>
          <div className="flex items-center justify-between text-[13px] font-bold pt-1">
            <span className="text-gray-900">{t('total')}</span>
            <span className="text-gray-900">{total != null ? `${total},00 €` : '—'}</span>
          </div>
        </div>

        {/* Stripe Payment Element */}
        {initError ? (
          <p className="text-[13px] text-red-600 text-center py-8">{initError}</p>
        ) : intent && stripePromise ? (
          <Elements stripe={stripePromise} options={{ clientSecret: intent.paymentIntentClientSecret, appearance: { theme: 'stripe' } }}>
            <CheckoutForm returnUrl={returnUrl} />
          </Elements>
        ) : (
          <div className="flex items-center justify-center py-12 text-[13px] text-gray-400">
            {t('loadingPayment')}
          </div>
        )}
      </div>
    </main>
  );
}
