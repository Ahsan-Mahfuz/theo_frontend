'use client';

import React, { useState, useEffect } from 'react';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function TimePickerDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Parse value to hour (1-12), minute (0-59), period (AM/PM)
  let hour12Str = '12';
  let minuteStr = '00';
  let period = 'AM';

  if (value) {
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
    if (match) {
      let h = parseInt(match[1]);
      const m = match[2];
      const p = match[3]?.toUpperCase();

      if (p === 'AM' || p === 'PM') {
        hour12Str = String(h).padStart(2, '0');
        minuteStr = m;
        period = p;
      } else {
        // 24-hour format fallback
        period = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        hour12Str = String(h).padStart(2, '0');
        minuteStr = m;
      }
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const handleSelect = (newH12: string, newMin: string, newPeriod: string) => {
    const formatted = `${newH12}:${newMin} ${newPeriod}`;
    onChange(formatted);
  };

  const displayVal = value || `${hour12Str}:${minuteStr} ${period}`;

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-11 px-3 rounded-lg border border-gray-200 bg-white hover:border-[#0084FF] focus-within:border-[#0084FF] transition-colors text-[13px] text-gray-800 font-medium outline-none"
      >
        <span>{displayVal}</span>
        <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 z-50 flex bg-white border border-gray-200 rounded-xl shadow-lg h-[240px] overflow-hidden min-w-[180px]">
          {/* Hours column */}
          <div className="flex flex-col w-1/3 overflow-y-auto border-r border-gray-100 scrollbar-none py-1">
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleSelect(h, minuteStr, period)}
                className={`py-1.5 text-center text-[13px] hover:bg-gray-100 transition-colors ${
                  h === hour12Str ? 'bg-[#0084FF] text-white font-bold hover:bg-[#0084FF]' : 'text-gray-700'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Minutes column */}
          <div className="flex flex-col w-1/3 overflow-y-auto border-r border-gray-100 scrollbar-none py-1">
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleSelect(hour12Str, m, period)}
                className={`py-1.5 text-center text-[13px] hover:bg-gray-100 transition-colors ${
                  m === minuteStr ? 'bg-[#0084FF] text-white font-bold hover:bg-[#0084FF]' : 'text-gray-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* AM/PM column */}
          <div className="flex flex-col w-1/3 py-1">
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleSelect(hour12Str, minuteStr, p)}
                className={`py-1.5 text-center text-[13px] hover:bg-gray-100 transition-colors ${
                  p === period ? 'bg-[#0084FF] text-white font-bold hover:bg-[#0084FF]' : 'text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
