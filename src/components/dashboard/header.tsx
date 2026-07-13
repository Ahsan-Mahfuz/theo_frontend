"use client";

import { AppImage, AVATAR_PLACEHOLDER } from "@/components/ui/app-image";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from "react";
import { Settings01Icon, Logout01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { useGetMeQuery } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { resolveAssetUrl } from '@/lib/config';
import { NotificationBell } from './notification-bell';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=';

export function DashboardHeader() {
  const t = useTranslations('Dashboard.nav');
  const c = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: user } = useGetMeQuery();
  const displayName =
    user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'My account';
  const email = user?.email || '';
  const avatar =
    resolveAssetUrl(user?.profileImage) || `${FALLBACK_AVATAR}${encodeURIComponent(displayName)}`;

  const handleSignOut = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    router.push('/login');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white h-20 flex items-center justify-between px-8 border-b border-gray-100">
      <div className="flex items-center">
        <AppImage
          src="/logo.svg"
          alt="Gestlio"
          width={110}
          height={35}
          className="h-10 w-auto"
        />
      </div>

      <div className="hidden md:flex items-center gap-8 text-[16px] font-medium text-gray-400">
        <Link 
          href="/dashboard" 
          className={pathname.endsWith('/dashboard') || pathname.includes('/dashboard/schedule') || pathname.includes('/dashboard/add-housekeeper') ? "text-[#0084FF] font-semibold" : "hover:text-gray-800 transition-colors"}
        >
          {t('home')}
        </Link>
        <Link 
          href="/dashboard/planning" 
          className={pathname.includes('/dashboard/planning') ? "text-[#0084FF] font-semibold" : "hover:text-gray-800 transition-colors"}
        >
          {t('planning')}
        </Link>
        <Link 
          href="/dashboard/housing" 
          className={pathname.includes('/dashboard/housing') ? "text-[#0084FF] font-semibold" : "hover:text-gray-800 transition-colors"}
        >
          {t('housing')}
        </Link>
        <Link
          href="/dashboard/message"
          className={pathname.includes('/dashboard/message') ? "text-[#0084FF] font-semibold" : "hover:text-gray-800 transition-colors"}
        >
          {t('message')}
        </Link>
        <Link
          href="/dashboard/revenue"
          className={pathname.includes('/dashboard/revenue') ? "text-[#0084FF] font-semibold" : "hover:text-gray-800 transition-colors"}
        >
          {t('revenue')}
        </Link>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <NotificationBell />
        <div
          className="relative w-10 h-10 rounded-full bg-gray-300 cursor-pointer overflow-hidden border border-gray-200"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <AppImage src={avatar} alt="Profile" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-[120%] w-[250px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200 z-50">
            {/* User Profile Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="relative w-[46px] h-[46px] rounded-full overflow-hidden shrink-0">
                <AppImage src={avatar} alt={displayName} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#4B443B] leading-tight mb-0.5">{displayName}</span>
                <span className="text-[12px] text-gray-500 leading-tight truncate max-w-[150px]">{email}</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-1">
              <Link href="/dashboard/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                <HugeiconsIcon icon={Settings01Icon} className="w-5 h-5 text-[#8D8276]" />
                <span className="text-[14px] text-gray-500 font-semibold">{t('settings')}</span>
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-red-400">
                <HugeiconsIcon icon={Logout01Icon} className="w-5 h-5 text-red-400" />
                <span className="text-[14px] font-semibold">{c('signOut')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
