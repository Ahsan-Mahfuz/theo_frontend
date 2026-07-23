'use client';

import React, { useState, useEffect } from 'react';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function TimePickerDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Parse 24-hour hour (00-23) and minute (00-59), with legacy 12h fallback handling
  let hour24Str = '10';
  let minuteStr = '00';

  if (value) {
    const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = match[2];
      const p = match[3]?.toUpperCase();

      if (p === 'PM' && h < 12) h += 12;
      if (p === 'AM' && h === 12) h = 0;

      hour24Str = String(h).padStart(2, '0');
      minuteStr = m;
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

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleSelect = (newHour: string, newMin: string) => {
    const formatted = `${newHour}:${newMin}`;
    onChange(formatted);
  };

  const displayVal = value ? (value.includes(' ') ? `${hour24Str}:${minuteStr}` : value) : `${hour24Str}:${minuteStr}`;

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
        <div className="absolute left-0 mt-1 z-50 flex bg-white border border-gray-200 rounded-xl shadow-lg h-[240px] overflow-hidden w-full min-w-[160px]">
          {/* Hours column */}
          <div className="flex flex-col w-1/2 overflow-y-auto border-r border-gray-100 scrollbar-none py-1">
            <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase text-center border-b border-gray-50">Hour</div>
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleSelect(h, minuteStr)}
                className={`py-1.5 text-center text-[13px] hover:bg-gray-100 transition-colors ${
                  h === hour24Str ? 'bg-[#0084FF] text-white font-bold hover:bg-[#0084FF]' : 'text-gray-700'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Minutes column */}
          <div className="flex flex-col w-1/2 overflow-y-auto scrollbar-none py-1">
            <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase text-center border-b border-gray-50">Min</div>
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleSelect(hour24Str, m)}
                className={`py-1.5 text-center text-[13px] hover:bg-gray-100 transition-colors ${
                  m === minuteStr ? 'bg-[#0084FF] text-white font-bold hover:bg-[#0084FF]' : 'text-gray-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
