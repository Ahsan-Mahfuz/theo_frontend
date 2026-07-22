"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n";
import { useState, useRef, useEffect } from "react";

const FLAG_EN = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="20" height="15" className="rounded-[2px] shadow-[0_0_1px_rgba(0,0,0,0.5)] overflow-hidden">
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const FLAG_FR = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="20" height="15" className="rounded-[2px] shadow-[0_0_1px_rgba(0,0,0,0.5)] overflow-hidden">
    <rect width="3" height="2" fill="#ED2939"/>
    <rect width="2" height="2" fill="#fff"/>
    <rect width="1" height="2" fill="#002395"/>
  </svg>
);

const LOCALES = [
  { code: 'en', label: 'English', flag: FLAG_EN },
  { code: 'fr', label: 'Français', flag: FLAG_FR },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLocale = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectLocale(code: string) {
    setIsOpen(false);
    router.replace(pathname, { locale: code });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl border border-slate-200 w-fit"
      >
        <div className="flex-shrink-0 flex items-center justify-center">{selectedLocale.flag}</div>
        <span className="hidden md:inline text-[13px] md:text-sm font-semibold pr-1">{selectedLocale.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform text-slate-500 ${isOpen ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => selectLocale(l.code)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left ${l.code === locale ? 'bg-slate-50 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className="flex-shrink-0 flex items-center justify-center">{l.flag}</div>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
