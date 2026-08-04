'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import {
  createSessionToken,
  fetchCitySuggestions,
  hasGooglePlaces,
  type PlaceSuggestion,
} from '@/lib/googlePlaces';

type Props = {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

/**
 * City field backed by Google Places autocomplete. Free text stays allowed — the
 * suggestions only help, and with no API key configured this is a plain input.
 */
export function CityAutocomplete({ value, onChange, placeholder, className, disabled }: Props) {
  const locale = useLocale();
  const listId = useId();
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sessionToken = useRef<any>(undefined);
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
    if (!hasGooglePlaces() || disabled) return;
    if (justPicked.current) {
      justPicked.current = false;
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (value.trim().length < 2) {
        if (!cancelled) {
          setSuggestions([]);
          setOpen(false);
        }
        return;
      }
      if (!sessionToken.current) sessionToken.current = await createSessionToken();
      const results = await fetchCitySuggestions(value, {
        language: locale,
        sessionToken: sessionToken.current,
      });
      if (cancelled) return;
      setSuggestions(results);
      setHighlight(-1);
      if (results.length > 0) setOpen(true);
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, locale, disabled]);

  const pick = (s: PlaceSuggestion) => {
    justPicked.current = true;
    // A pick closes the billing session; the next lookup starts a fresh one.
    sessionToken.current = undefined;
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
