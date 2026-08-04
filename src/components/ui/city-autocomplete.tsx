'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { fetchCitySuggestions, type CitySuggestion } from '@/lib/citySearch';

type Props = {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

/**
 * City field backed by the free BAN / Photon lookup. Free text stays allowed —
 * the suggestions only help, and if the lookup fails this is a plain input.
 */
export function CityAutocomplete({ value, onChange, placeholder, className, disabled }: Props) {
  const locale = useLocale();
  const listId = useId();
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Set while the user picks a suggestion, so the resulting value change doesn't
  // immediately re-query and re-open the list.
  const justPicked = useRef(false);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Debounced lookup — one request per pause in typing.
  useEffect(() => {
    if (disabled) return;
    if (justPicked.current) {
      justPicked.current = false;
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (value.trim().length < 2) {
        if (!cancelled) {
          setSuggestions([]);
          setOpen(false);
        }
        return;
      }
      const results = await fetchCitySuggestions(value, {
        language: locale,
        signal: controller.signal,
      });
      if (cancelled) return;
      setSuggestions(results);
      setHighlight(-1);
      if (results.length > 0) setOpen(true);
    }, 250);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [value, locale, disabled]);

  const pick = (s: CitySuggestion) => {
    justPicked.current = true;
    onChange(s.main);
    setSuggestions([]);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && highlight >= 0) {
      e.preventDefault();
      pick(suggestions[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={wrapRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        autoComplete="off"
        role="combobox"
        aria-controls={listId}
        aria-expanded={open}
        aria-autocomplete="list"
      />

      {open && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          {suggestions.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => pick(s)}
                className={`flex w-full items-baseline gap-2 px-4 py-2.5 text-left transition-colors ${
                  i === highlight ? 'bg-gray-50' : ''
                }`}
              >
                <span className="text-[13px] font-medium text-gray-900">{s.main}</span>
                {s.secondary && (
                  <span className="truncate text-[11px] text-gray-400">{s.secondary}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
