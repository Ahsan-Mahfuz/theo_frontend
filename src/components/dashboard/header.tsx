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

// Single source of truth for the nav so the desktop bar and the mobile menu never drift apart.
const NAV_LINKS: { href: string; key: string; isActive: (pathname: string) => boolean }[] = [
  {
    href: '/dashboard',
    key: 'home',
    isActive: (p) =>
      p.endsWith('/dashboard') || p.includes('/dashboard/schedule') || p.includes('/dashboard/add-housekeeper'),
  },
  { href: '/dashboard/planning', key: 'planning', isActive: (p) => p.includes('/dashboard/planning') },
  { href: '/dashboard/housing', key: 'housing', isActive: (p) => p.includes('/dashboard/housing') },
  { href: '/dashboard/message', key: 'message', isActive: (p) => p.includes('/dashboard/message') },
  // { href: '/dashboard/revenue', key: 'revenue', isActive: (p) => p.includes('/dashboard/revenue') },
];

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
    <nav className="relative w-full bg-white h-20 flex items-center justify-between px-5 md:px-8 border-b border-gray-100">
      <div className="flex items-center">
        {/* The logo doubles as the "go home" shortcut. */}
        <Link href="/dashboard" aria-label="Gestlio">
          <AppImage
            src="/logo.svg"
            alt="Gestlio"
            width={110}
            height={35}
            className="h-10 w-auto cursor-pointer"
          />
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-[16px] font-medium text-gray-400">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={link.isActive(pathname) ? "text-[#0084FF] font-semibold" : "hover:text-gray-800 transition-colors"}
          >
            {t(link.key)}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>
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

            {/* Nav links — below md the dropdown is the only way to reach the other pages. */}
            <div className="md:hidden flex flex-col gap-1 mb-3 pb-3 border-b border-gray-100">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsDropdownOpen(false)}
                  className={`px-3 py-2.5 rounded-xl transition-colors text-[14px] font-semibold ${
                    link.isActive(pathname)
                      ? 'text-[#0084FF] bg-[#0084FF]/5'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
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
