'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Location01Icon,
  Camera01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import {
  useGetAccommodationByIdQuery,
  useUpdateAccommodationMutation,
} from '@/store/api/accommodationApi';
import { resolveAssetUrl } from '@/lib/config';
import { getApiErrorMessage } from '@/lib/apiError';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';

const avatarFor = (name: string) => `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'H')}`;

export default function EditAccommodationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const t = useTranslations('Housing.edit');
  const c = useTranslations('Common');

  const { data: accommodation, isLoading } = useGetAccommodationByIdQuery(id);
  const [updateAccommodation, { isLoading: isSaving }] = useUpdateAccommodationMutation();

  const [error, setError] = useState('');

  // New photo the user picks (replaces the current cover on save).
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [accommodationType, setAccommodationType] = useState('Apartment');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Paris');
  const [zipCode, setZipCode] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState('');
  const [surface, setSurface] = useState('');
  const [floor, setFloor] = useState('');
  const [hasElevator, setHasElevator] = useState(false);
  const [cleaningRate, setCleaningRate] = useState('');
  const [notes, setNotes] = useState('');
  const [keys, setKeys] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [frequency, setFrequency] = useState('');

  useEffect(() => {
    if (!accommodation) return;
    setName(accommodation.name ?? '');
    setAccommodationType(accommodation.accommodationType ?? 'Apartment');
    setAddress(accommodation.address ?? '');
    setCity(accommodation.city ?? 'Paris');
    setZipCode(accommodation.zipCode ?? '');
    setNumberOfRooms(String(accommodation.numberOfRooms ?? ''));
    setSurface(String(accommodation.surface ?? ''));
    setFloor(accommodation.floor ?? '');
    setHasElevator(Boolean(accommodation.hasElevator));
    setCleaningRate(String(accommodation.cleaningRate ?? ''));
    setNotes(accommodation.notes ?? '');
    setKeys(accommodation.keys ?? '');
    setAccessCode(accommodation.accessCode ?? '');
    setInstructions(accommodation.instructions ?? '');
    setFrequency(accommodation.frequency ?? '');
  }, [accommodation]);

  const cleaners = (accommodation?.assignedCleaners ?? []) as any[];
  const primaryEntry = cleaners.find((c) => c.role === 'primary') || null;
  const substituteEntries = cleaners.filter((c) => c.role === 'substitute');
  const cleanerName = (c: any) => c?.name || `${c?.firstName ?? ''} ${c?.lastName ?? ''}`.trim() || 'Cleaner';
  const cleanerAvatar = (c: any) => resolveAssetUrl(c?.profileImage) || avatarFor(cleanerName(c));

  // Show the freshly-picked photo if any, otherwise the saved cover.
  const coverImage =
    photoPreview || resolveAssetUrl(accommodation?.photos?.[0]) || avatarFor(accommodation?.name || 'H');

  // Revoke the object URL when it changes / on unmount to avoid leaks.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('accommodationType', accommodationType);
      fd.append('address', address);
      fd.append('city', city);
      fd.append('zipCode', zipCode);
      fd.append('numberOfRooms', String(parseInt(numberOfRooms) || 0));
      fd.append('surface', String(parseFloat(surface) || 0));
      fd.append('floor', floor);
      fd.append('hasElevator', hasElevator ? 'true' : 'false');
      fd.append('cleaningRate', String(parseFloat(cleaningRate) || 0));
      fd.append('notes', notes);
      fd.append('keys', keys);
      fd.append('accessCode', accessCode);
      fd.append('instructions', instructions);
      fd.append('frequency', frequency);
      if (photoFile) fd.append('photos', photoFile);
      await updateAccommodation({ id, body: fd }).unwrap();
      router.push(`/dashboard/housing/${id}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const inputClass = 'h-11 px-4 rounded-xl bg-[#F8F9FA] border-transparent text-[13px] text-gray-900 focus:bg-white focus:border-[#0084FF] focus:ring-4 focus:ring-[#0084FF]/10 outline-none transition-all';

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 max-w-[1200px] mx-auto">

      {/* Header */}
      <h1 className="text-[32px] font-bold text-gray-900 mb-10">{t('title')}</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Column - Accommodation Card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-4">
            <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden relative">
              <AppImage src={coverImage} alt={name} fill className="object-cover" />
            </div>
            <div className="flex flex-col px-2 pb-2">
              <h3 className="text-[16px] font-bold text-gray-900 mb-1">{name}</h3>
              <div className="flex items-center gap-1.5 mb-6">
                <HugeiconsIcon icon={Location01Icon} className="w-[14px] h-[14px] text-gray-400" />
                <span className="text-[13px] text-gray-500">{address ? `${address}, ${city}` : t('locationFallback')}</span>
              </div>

              {/* Cleaners in Card */}
              {(primaryEntry || substituteEntries.length > 0) && (
                <div className="flex flex-col gap-4 mt-auto">
                   {primaryEntry && (
                     <div className="flex flex-col gap-1.5">
                       <span className="text-[10px] text-gray-500">{t('primary')}</span>
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                             <AppImage src={cleanerAvatar(primaryEntry.cleaner)} alt={cleanerName(primaryEntry.cleaner)} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-gray-900">{cleanerName(primaryEntry.cleaner)}</span>
                             <span className="text-[10px] text-gray-400">{primaryEntry.status}</span>
                          </div>
                       </div>
                     </div>
                   )}
                   {substituteEntries.length > 0 && (
                     <div className="flex flex-col gap-1.5">
                       <span className="text-[10px] text-gray-500">{t('substitutes')}</span>
                       <div className="flex flex-col gap-2">
                         {substituteEntries.map((sub) => (
                           <div key={sub.assignmentId || sub._id} className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                                 <AppImage src={cleanerAvatar(sub.cleaner)} alt={cleanerName(sub.cleaner)} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-gray-900">{cleanerName(sub.cleaner)}</span>
                                 <span className="text-[10px] text-gray-400">{sub.status}</span>
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="flex-1">
          <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-8 lg:p-12 flex flex-col max-w-[600px] mx-auto">

            {/* Editable photo */}
            <div className="flex flex-col items-center mb-8">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group w-[120px] h-[120px] bg-[#F8F9FA] rounded-[16px] flex items-center justify-center border border-gray-100 overflow-hidden relative hover:border-[#0084FF] transition-colors"
              >
                {photoPreview || accommodation?.photos?.[0] ? (
                  <>
                    <AppImage src={coverImage} alt={name} fill className="object-cover" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <HugeiconsIcon icon={Camera01Icon} className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-400">
                    <HugeiconsIcon icon={Camera01Icon} className="w-6 h-6" />
                    <span className="text-[10px] uppercase tracking-widest">{t('photo')}</span>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-[12px] font-semibold text-[#0084FF] hover:underline"
              >
                {t('changePhoto')}
              </button>
              <span className="text-[10px] text-gray-400 mt-1">{t('photoHint')}</span>
            </div>

            {/* Section 1 */}
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-[14px] font-bold text-gray-900">{t('practicalInfo')}</h2>
              <span className="text-[11px] text-gray-500">{t('practicalInfoSub')}</span>
            </div>

            <div className="flex flex-col gap-5 mb-10">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('nameLabel')}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('typeLabel')}</label>
                <select value={accommodationType} onChange={(e) => setAccommodationType(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="Apartment">{t('typeApartment')}</option>
                  <option value="House">{t('typeHouse')}</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('addressLabel')}</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('cityLabel')}</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                  <option>Paris</option>
                  <option>Lyon</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('zipLabel')}</label>
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-[14px] font-bold text-gray-900">{t('detailsTitle')}</h2>
              <span className="text-[11px] text-gray-500">{t('detailsSub')}</span>
            </div>

            <div className="flex flex-col gap-5 mb-10">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('roomsLabel')}</label>
                <input type="text" value={numberOfRooms} onChange={(e) => setNumberOfRooms(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[12px] font-medium text-gray-700">{t('surfaceLabel')}</label>
                <input type="text" value={surface} onChange={(e) => setSurface(e.target.value)} className={`${inputClass} w-full pr-12`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('floorLabel')}</label>
                <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[12px] font-medium text-gray-700">{t('elevatorLabel')}</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasElevator(true)}
                    className={`flex-1 h-10 rounded-xl text-[13px] font-medium transition-colors ${hasElevator ? 'bg-white border border-[#0084FF] text-[#0084FF]' : 'bg-[#F8F9FA] text-gray-500 hover:bg-gray-100'}`}
                  >{c('yes')}</button>
                  <button
                    type="button"
                    onClick={() => setHasElevator(false)}
                    className={`flex-1 h-10 rounded-xl text-[13px] font-medium transition-colors ${!hasElevator ? 'bg-white border border-[#0084FF] text-[#0084FF]' : 'bg-[#F8F9FA] text-gray-500 hover:bg-gray-100'}`}
                  >{c('no')}</button>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-4">
                <label className="text-[12px] font-medium text-gray-700">{t('cleaningRateLabel')}</label>
                <input type="text" value={cleaningRate} onChange={(e) => setCleaningRate(e.target.value)} className={inputClass} />
                <span className="text-[10px] text-gray-400">{t('cleaningRateHint')}</span>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12px] font-medium text-gray-700">{t('notesLabel')}</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notesPlaceholder')} className="h-24 p-4 rounded-xl bg-[#F8F9FA] border-transparent text-[13px] text-gray-900 focus:bg-white focus:border-[#0084FF] focus:ring-4 focus:ring-[#0084FF]/10 outline-none transition-all resize-none"></textarea>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-[14px] font-bold text-gray-900">{t('practicalInfo')}</h2>
              <span className="text-[11px] text-gray-500">{t('practicalInfoSub')}</span>
            </div>

            <div className="flex flex-col gap-5 mb-10">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('keysLabel')}</label>
                <input type="text" value={keys} onChange={(e) => setKeys(e.target.value)} placeholder={t('keysPlaceholder')} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('accessCodeLabel')}</label>
                <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder={t('accessCodePlaceholder')} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('instructionsLabel')}</label>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder={t('instructionsPlaceholder')} className="h-24 p-4 rounded-xl bg-[#F8F9FA] border-transparent text-[13px] text-gray-900 focus:bg-white focus:border-[#0084FF] focus:ring-4 focus:ring-[#0084FF]/10 outline-none transition-all resize-none"></textarea>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-700">{t('frequencyLabel')}</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="">{t('selectFrequency')}</option>
                  <option value="Every week">{t('everyWeek')}</option>
                  <option value="Every 2 weeks">{t('every2Weeks')}</option>
                </select>
              </div>
            </div>

            {error && <p className="text-[12px] text-red-600 mb-4">{error}</p>}

            {/* Submit Button */}
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="w-full h-12 bg-[#0084FF] text-white text-[13px] font-medium rounded-xl hover:bg-[#0073E6] transition-colors mt-2 shadow-[0_4px_12px_rgba(0,132,255,0.2)] disabled:opacity-60"
            >
              {isSaving ? c('saving') : c('save')}
            </button>

          </div>
        </div>

      </div>

    </main>
  );
}
