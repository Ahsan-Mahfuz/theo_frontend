'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Location01Icon,
  Calendar01Icon,
  Time02Icon,
  Tick02Icon,
  Cancel01Icon,
  Alert02Icon,
  CheckmarkCircle01Icon,
  Coins01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetScheduleByIdQuery,
  useCompleteScheduleMutation,
  useInvalidateProofMutation,
  useInitiateHandCashMutation,
  useApproveHandCashMutation,
} from '@/store/api/scheduleApi';
import { resolveAssetUrl } from '@/lib/config';
import { formatDate, formatDateTime } from '@/lib/datetime';
import { getApiErrorMessage } from '@/lib/apiError';
import { useAuth } from '@/store/hooks';

const FALLBACK_ROOM =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500';

/* eslint-disable @typescript-eslint/no-explicit-any */
const nameOf = (p: any): string =>
  p?.name || [p?.firstName, p?.lastName].filter(Boolean).join(' ') || '—';
const avatarFor = (name: string) =>
  `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'Cleaner')}`;
const cleanerAvatar = (cl: any) => resolveAssetUrl(cl?.profileImage) || avatarFor(nameOf(cl));

// Status pill colours (mirrors the planning list palette).
const STATUS_CLS: Record<string, string> = {
  scheduled: 'bg-[#FFF7E6] text-[#D48806]',
  accepted: 'bg-[#E5F9F1] text-[#48C79D]',
  in_progress: 'bg-[#E6F0FF] text-[#0084FF]',
  proof_submitted: 'bg-[#F3E8FF] text-[#7C3AED]',
  completed: 'bg-[#E5F9F1] text-[#137333]',
  refused: 'bg-[#FFF0F0] text-[#FF4D4F]',
  disputed: 'bg-[#FFF0F0] text-[#FF4D4F]',
  cancelled: 'bg-gray-100 text-gray-500',
};

const isPaid = (s: any) => s?.paymentStatus === 'paid_held' || s?.paymentStatus === 'released' || s?.paymentStatus === 'paid_handcash';
const PAYABLE_STATUSES = ['accepted', 'in_progress', 'proof_submitted', 'completed'];
const needsPayment = (s: any) => PAYABLE_STATUSES.includes(s?.status) && !isPaid(s) && s?.paymentStatus !== 'handcash_pending';

export default function TaskDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Tasks');
  const c = useTranslations('Common');
  
  const { user } = useAuth();

  const { data, isLoading, isError } = useGetScheduleByIdQuery(id, { skip: !id });
  const [completeSchedule, { isLoading: completing }] = useCompleteScheduleMutation();
  const [invalidateProof, { isLoading: rejecting }] = useInvalidateProofMutation();
  const [initiateHandCash, { isLoading: initiatingHandCash }] = useInitiateHandCashMutation();
  const [approveHandCash, { isLoading: approvingHandCash }] = useApproveHandCashMutation();

  const [actionError, setActionError] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const goPay = (scheduleId: string, accId: string) =>
    router.push(`/dashboard/housing/${accId}/payment?scheduleId=${scheduleId}`);

  const s = data as any;

  const dateLabel = (d?: string) =>
    formatDate(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, locale);
  const dateTimeLabel = (d?: string) =>
    formatDateTime(d, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }, locale);

  const handleComplete = async () => {
    setActionError('');
    try {
      await completeSchedule(id).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    }
  };

  const handleReject = async () => {
    setActionError('');
    try {
      await invalidateProof({ id, reason: rejectReason.trim() || undefined }).unwrap();
      setRejectOpen(false);
      setRejectReason('');
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    }
  };

  const handleHandCash = async () => {
    setActionError('');
    try {
      await initiateHandCash(id).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    }
  };

  const handleApproveHandCash = async () => {
    setActionError('');
    try {
      await approveHandCash(id).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-[600px] bg-white rounded-[24px] border border-gray-100 p-10 flex flex-col gap-6">
          <Skeleton className="h-6 w-40 rounded mx-auto" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !s) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <p className="text-[13px] text-gray-500">{t('notFound')}</p>
        <button onClick={() => router.push('/dashboard')} className="h-11 px-6 rounded-xl bg-black text-white text-[13px] font-medium">
          {c('backToHome')}
        </button>
      </div>
    );
  }

  const acc = s.accommodation ?? {};
  const photo = acc?.photos?.[0] ? resolveAssetUrl(acc.photos[0]) : FALLBACK_ROOM;
  const status = s.scheduleStatus || s.status;
  const proofPhotos: string[] = s.proofPhotos ?? [];
  const dispute = s.dispute;
  const canReview = status === 'proof_submitted';

  return (
    <div className="w-full flex items-start justify-center py-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="w-full max-w-[600px] bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 p-8 md:p-10 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-bold text-gray-900">{t('detailTitle')}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_CLS[status] ?? STATUS_CLS.scheduled}`}>
              {t(`status.${status}` as any)}
            </span>
            {isPaid(s) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E5F9F1] text-[#137333]">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-3 h-3" />
                {t('paidBadge')}
              </span>
            )}
            {s.paymentStatus === 'handcash_pending' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFF7E6] text-[#D48806]">
                <HugeiconsIcon icon={Coins01Icon} className="w-3 h-3" />
                {t('handCash')}
              </span>
            )}
          </div>
        </div>

        {/* Accommodation */}
        <span className="text-[13px] font-bold text-gray-900 mb-3">{t('accommodation')}</span>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-[90px] h-[90px] rounded-xl overflow-hidden relative bg-gray-200 shrink-0">
            <AppImage src={photo} alt={acc?.name || 'Accommodation'} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <span className="text-[13px] font-bold text-gray-900 truncate">{acc?.name || t('accommodation')}</span>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-600">{acc?.city || acc?.address || '—'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Calendar01Icon} className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-600">{dateLabel(s.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-600">{s.checkInTime}–{s.checkOutTime}</span>
            </div>
          </div>
        </div>

        {/* Cleaner */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
              <AppImage src={cleanerAvatar(s.cleaner)} alt="Cleaner" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-gray-900">{nameOf(s.cleaner)}</span>
              <span className="text-[11px] text-gray-500">{t('housekeeper')}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/message')}
            className="px-4 py-1.5 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('message')}
          </button>
        </div>

        {/* Proof of completion */}
        {(proofPhotos.length > 0 || s.proofNotes || ['proof_submitted', 'completed'].includes(status)) && (
          <div className="border-t border-gray-100 pt-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-gray-900">{t('proofTitle')}</span>
              {s.proofSubmittedAt && (
                <span className="text-[10px] text-gray-400">{t('submittedOn', { date: dateTimeLabel(s.proofSubmittedAt) })}</span>
              )}
            </div>
            {proofPhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {proofPhotos.map((p, i) => {
                  const src = resolveAssetUrl(p) || p;
                  return (
                    <button
                      key={i}
                      onClick={() => setPreview(src)}
                      className="aspect-square rounded-xl overflow-hidden relative bg-gray-100 hover:opacity-90 transition-opacity"
                    >
                      <AppImage src={src} alt={`Proof ${i + 1}`} fill className="object-cover" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[12px] text-gray-400 mb-2">{t('noProof')}</p>
            )}
            {s.proofNotes && (
              <div className="bg-[#F8F9FA] rounded-xl p-3">
                <span className="text-[11px] font-bold text-gray-500">{t('proofNotes')}</span>
                <p className="text-[12px] text-gray-700 mt-1 leading-relaxed">{s.proofNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Dispute */}
        {dispute && (
          <div className="border-t border-gray-100 pt-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <HugeiconsIcon icon={Alert02Icon} className="w-4 h-4 text-[#FF4D4F]" />
              <span className="text-[13px] font-bold text-[#FF4D4F]">{t('disputeTitle')}</span>
              {dispute.raisedAt && (
                <span className="text-[10px] text-gray-400 ml-auto">{t('raisedOn', { date: dateTimeLabel(dispute.raisedAt) })}</span>
              )}
            </div>
            {dispute.reason && (
              <p className="text-[12px] text-gray-700 mb-1"><span className="font-bold text-gray-500">{t('disputeReason')}: </span>{dispute.reason}</p>
            )}
            {dispute.notes && (
              <p className="text-[12px] text-gray-700 mb-3"><span className="font-bold text-gray-500">{t('disputeNotes')}: </span>{dispute.notes}</p>
            )}
            {Array.isArray(dispute.photos) && dispute.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {dispute.photos.map((p: string, i: number) => {
                  const src = resolveAssetUrl(p) || p;
                  return (
                    <button key={i} onClick={() => setPreview(src)} className="aspect-square rounded-xl overflow-hidden relative bg-gray-100 hover:opacity-90 transition-opacity">
                      <AppImage src={src} alt={`Dispute ${i + 1}`} fill className="object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Awaiting hint */}
        {['accepted', 'in_progress'].includes(status) && proofPhotos.length === 0 && !dispute && (
          <div className="bg-[#F8F9FA] rounded-xl p-4 mb-6">
            <p className="text-[12px] text-gray-500">{t('awaitingProof')}</p>
          </div>
        )}

        {actionError && <p className="text-[12px] text-red-500 mb-4">{actionError}</p>}

        {/* Host actions when the cleaner has submitted proof */}
        {canReview && (
          <div className="border-t border-gray-100 pt-6 flex flex-col gap-3">
            <p className="text-[12px] text-gray-500">{t('validateCleaningDesc')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setRejectOpen(true)}
                disabled={completing || rejecting}
                className="h-11 px-5 rounded-xl bg-white border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                {t('rejectProof')}
              </button>
              <button
                onClick={handleComplete}
                disabled={completing || rejecting}
                className="flex-1 h-11 rounded-xl bg-[#10B981] text-white text-[13px] font-bold hover:bg-[#059669] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
                {completing ? t('validating') : t('validateCleaning')}
              </button>
            </div>
          </div>
        )}

        {/* Pay Now — visible after job is done but host hasn't paid yet */}
        {needsPayment(s) && (
          <div className="border-t border-gray-100 pt-6 flex flex-col gap-3">
            <p className="text-[12px] text-gray-500">{t('payNowHint')}</p>
            <div className="flex gap-3">
              <button
                onClick={handleHandCash}
                disabled={initiatingHandCash}
                className="flex-1 h-11 rounded-xl bg-[#10B981] text-white text-[13px] font-bold hover:bg-[#059669] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <HugeiconsIcon icon={Coins01Icon} className="w-4 h-4" />
                {initiatingHandCash ? c('loading') : t('handCash')}
              </button>
              <button
                onClick={() => goPay(id, acc?._id || s.accommodation?._id || '')}
                className="flex-1 h-11 rounded-xl bg-[#0084FF] text-white text-[13px] font-bold hover:bg-[#0073E6] flex items-center justify-center gap-2"
              >
                <HugeiconsIcon icon={Coins01Icon} className="w-4 h-4" />
                {t('payNow')}
              </button>
            </div>
          </div>
        )}

        {/* Hand cash pending — cleaner needs to approve */}
        {s.paymentStatus === 'handcash_pending' && (
          <div className="border-t border-gray-100 pt-6 flex flex-col gap-3">
            <p className="text-[12px] text-[#D48806] font-medium">{t('handcashPendingHint')}</p>
            {user?.role === 'cleaner' && (
              <button
                onClick={handleApproveHandCash}
                disabled={approvingHandCash}
                className="w-full h-11 rounded-xl bg-[#10B981] text-white text-[13px] font-bold hover:bg-[#059669] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
                {approvingHandCash ? c('loading') : t('approveHandCash')}
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full h-11 bg-black text-white rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors mt-6"
        >
          {c('backToHome')}
        </button>
      </div>

      {/* Image preview lightbox */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 animate-in fade-in duration-200" onClick={() => setPreview(null)}>
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-[720px] aspect-video" onClick={(e) => e.stopPropagation()}>
            <AppImage src={preview} alt="Preview" fill className="object-contain" />
          </div>
        </div>
      )}

      {/* Reject-proof reason modal */}
      {rejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200" onClick={() => !rejecting && setRejectOpen(false)}>
          <div className="bg-white rounded-[20px] w-full max-w-[440px] p-6 shadow-xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-gray-900">{t('rejectTitle')}</h3>
              <button onClick={() => setRejectOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12px] text-gray-500 mb-4">{t('rejectDesc')}</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('rejectReasonPlaceholder')}
              className="w-full h-24 bg-[#F8F9FA] border border-transparent rounded-xl p-3 text-[13px] text-gray-900 focus:bg-white focus:border-[#0084FF] outline-none resize-none mb-4"
            />
            {actionError && <p className="text-[12px] text-red-500 mb-3">{actionError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setRejectOpen(false)} disabled={rejecting} className="flex-1 h-11 rounded-xl bg-white border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50">
                {c('cancel')}
              </button>
              <button onClick={handleReject} disabled={rejecting} className="flex-1 h-11 rounded-xl bg-[#FF4D4F] text-white text-[13px] font-medium hover:bg-[#E64345] disabled:opacity-50">
                {rejecting ? t('rejecting') : t('rejectConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
