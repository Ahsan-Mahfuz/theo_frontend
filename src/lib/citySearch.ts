/**
 * City autocomplete backed by two free, key-less geocoders.
 *
 * 1. Base Adresse Nationale (api-adresse.data.gouv.fr) — the French government's
 *    official address API. No key, no billing, no quota to speak of, and the most
 *    accurate source for French communes, which is what this app mostly deals with.
 * 2. Photon (photon.komoot.io) — OpenStreetMap type-ahead geocoder, used only when
 *    BAN comes back empty, so cities outside France still resolve.
 *
 * Both are best-effort: any network / quota / parsing problem degrades to "no
 * suggestions" and the field stays a plain text input.
 */

export type CitySuggestion = {
  id: string;
  /** The city itself — what we put in the input. */
  main: string;
  /** Region / country, shown greyed next to it. */
  secondary: string;
};

type LookupOptions = {
  /** UI locale — Photon localises its labels; BAN is French-only anyway. */
  language?: string;
  /** Lets the caller drop an in-flight request when the user keeps typing. */
  signal?: AbortSignal;
};

const LIMIT = 6;

// Photon only ships labels for these; anything else falls back to English.
const PHOTON_LANGS = ["de", "en", "fr", "it"];

const photonLang = (language?: string) => {
  const lang = (language ?? "").slice(0, 2).toLowerCase();
  return PHOTON_LANGS.includes(lang) ? lang : "en";
};

/** Both APIs answer with GeoJSON, so one loose shape covers them. */
type GeoFeature = { properties?: Record<string, unknown> };

const str = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));

const fetchFeatures = async (url: string, signal?: AbortSignal): Promise<GeoFeature[]> => {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { features?: GeoFeature[] };
    return data?.features ?? [];
  } catch {
    // aborted, offline, rate-limited — the caller just shows nothing
    return [];
  }
};

/** French communes, straight from the BAN. */
async function fetchFromBan(query: string, signal?: AbortSignal): Promise<CitySuggestion[]> {
  const url =
    "https://api-adresse.data.gouv.fr/search/" +
    `?q=${encodeURIComponent(query)}&type=municipality&autocomplete=1&limit=${LIMIT}`;

  const features = await fetchFeatures(url, signal);

  return features
    .map((f) => {
      const p = f.properties ?? {};
      const main = str(p.city) || str(p.name) || str(p.label);
      return {
        id: str(p.id) || str(p.citycode) || main,
        main,
        // "35, Ille-et-Vilaine, Bretagne" — département, then region
        secondary: str(p.context),
      };
    })
    .filter((s) => s.main);
}

/** Worldwide fallback — cities, towns and villages from OpenStreetMap. */
async function fetchFromPhoton(
  query: string,
  language?: string,
  signal?: AbortSignal,
): Promise<CitySuggestion[]> {
  const url =
    "https://photon.komoot.io/api/" +
    `?q=${encodeURIComponent(query)}&limit=${LIMIT}&lang=${photonLang(language)}` +
    "&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village";

  const features = await fetchFeatures(url, signal);

  return features
    .map((f) => {
      const p = f.properties ?? {};
      const main = str(p.name);
      return {
        id: str(p.osm_id) || main,
        main,
        secondary: [str(p.state), str(p.country)].filter(Boolean).join(", "),
      };
    })
    .filter((s) => s.main);
}

/**
 * City predictions for `input`: French communes first, then a worldwide lookup
 * when France has nothing to offer. Returns [] rather than throwing.
 */
export async function fetchCitySuggestions(
  input: string,
  opts: LookupOptions = {},
): Promise<CitySuggestion[]> {
  const query = input.trim();
  if (query.length < 2) return [];

  const french = await fetchFromBan(query, opts.signal);
  if (french.length > 0) return french;

  return fetchFromPhoton(query, opts.language, opts.signal);
}
