/**
 * Thin wrapper around the Google Maps JS API "places" library.
 *
 * The key is optional on purpose: without NEXT_PUBLIC_GOOGLE_MAPS_API_KEY every
 * helper here resolves to "no suggestions", so the fields that use it degrade to
 * plain text inputs instead of breaking.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    google?: any;
  }
}

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export const hasGooglePlaces = () => GOOGLE_MAPS_API_KEY.length > 0;

const SCRIPT_ID = 'google-maps-places';

let placesPromise: Promise<any | null> | null = null;

/** Loads (once) the Maps JS API and returns its places library, or null. */
export function loadPlacesLibrary(): Promise<any | null> {
  if (typeof window === 'undefined' || !hasGooglePlaces()) return Promise.resolve(null);
  if (placesPromise) return placesPromise;

  placesPromise = new Promise((resolve) => {
    const finish = async () => {
      try {
        resolve(await window.google.maps.importLibrary('places'));
      } catch {
        resolve(null);
      }
    };

    if (window.google?.maps?.importLibrary) {
      finish();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', finish);
    script.addEventListener('error', () => resolve(null));

    if (!existing) {
      script.id = SCRIPT_ID;
      script.async = true;
      script.src =
        'https://maps.googleapis.com/maps/api/js' +
        `?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&libraries=places&loading=async&v=weekly`;
      document.head.appendChild(script);
    }
  });

  return placesPromise;
}

export type PlaceSuggestion = {
  id: string;
  /** The city itself — what we put in the input. */
  main: string;
  /** Region / country, shown greyed next to it. */
  secondary: string;
};

/** FormattableText | string | undefined → string */
const asText = (v: any): string => {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v.text ?? String(v);
};

/** Creates a session token so a type-ahead + pick counts as one billed session. */
export async function createSessionToken(): Promise<any | undefined> {
  const places = await loadPlacesLibrary();
  try {
    return places?.AutocompleteSessionToken ? new places.AutocompleteSessionToken() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * City predictions for `input`. Prefers the Places API (New) suggestion service
 * and falls back to the legacy AutocompleteService when it isn't available.
 */
export async function fetchCitySuggestions(
  input: string,
  opts: { language?: string; sessionToken?: any } = {},
): Promise<PlaceSuggestion[]> {
  const query = input.trim();
  if (!query) return [];

  const places = await loadPlacesLibrary();
  if (!places) return [];

  try {
    if (places.AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
      const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: query,
        includedPrimaryTypes: ['(cities)'],
        language: opts.language,
        sessionToken: opts.sessionToken,
      });

      return (suggestions ?? [])
        .map((s: any) => s.placePrediction)
        .filter(Boolean)
        .map((p: any) => ({
          id: p.placeId ?? asText(p.text),
          main: asText(p.mainText) || asText(p.text),
          secondary: asText(p.secondaryText),
        }))
        .filter((s: PlaceSuggestion) => s.main);
    }

    if (places.AutocompleteService) {
      const service = new places.AutocompleteService();
      const predictions: any[] = await new Promise((resolve) => {
        service.getPlacePredictions(
          { input: query, types: ['(cities)'], sessionToken: opts.sessionToken },
          (res: any[] | null) => resolve(res ?? []),
        );
      });

      return predictions.map((p) => ({
        id: p.place_id ?? p.description,
        main: p.structured_formatting?.main_text ?? p.description,
        secondary: p.structured_formatting?.secondary_text ?? '',
      }));
    }
  } catch {
    // network / quota / restricted key — treat as "no suggestions"
  }

  return [];
}
