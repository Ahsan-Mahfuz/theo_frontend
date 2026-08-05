// Cleaning price breakdown — mirrors the backend escrow model so the UI never
// shows a total different from what the host is actually charged.
//
// Backend (payment.service.ts):
//   cleanerAmount = agreed pricePerCleaning / cleaningRate  ← paid out in full
//   platformFee   = round(cleanerAmount * feePercent / 100) ← platform keeps this
//   amount        = cleanerAmount + platformFee             ← what the host pays
//
// The fee is added ON TOP of the cleaner's rate, never deducted from it: the
// cleaner is paid their full rate and only ever sees that number.
//
// So on screen:  Cleaning Service (cleanerAmount) + Service Fee (platformFee) = Total (amount)

// Fallback only — the live value comes from GET /settings/public (the
// commission an admin sets in the dashboard). Matches the backend default.
export const PLATFORM_FEE_PERCENT = 5;

export interface SchedulePrice {
  /** Total the host is charged: cleaner's rate + service fee. */
  total: number;
  /** Platform's cut, charged on top of the cleaner's rate. */
  serviceFee: number;
  /** The cleaner's rate — what actually reaches the cleaner. */
  cleaningService: number;
  /** Fee percentage used for this breakdown. */
  feePercent: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export const computeSchedulePrice = (
  pricePerCleaning?: number | null,
  cleaningRate?: number | null,
  feePercent: number = PLATFORM_FEE_PERCENT,
): SchedulePrice => {
  const base = Number(pricePerCleaning ?? cleaningRate ?? 0) || 0;
  const pct = Number.isFinite(feePercent) ? feePercent : PLATFORM_FEE_PERCENT;
  const serviceFee = round2((base * pct) / 100);
  return {
    total: round2(base + serviceFee),
    serviceFee,
    cleaningService: round2(base),
    feePercent: pct,
  };
};

// Amount used across the schedule flow. Whole euros render without centimes
// ("250 €"); only genuine fractional prices keep the decimals ("2.50 €").
// The separator is a point, not a comma — a comma reads as a thousands
// separator to many users and made totals ambiguous on the checkout screen.
export const formatEuro = (amount: number): string => {
  const rounded = Math.round(amount * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  return `${text} €`;
};

// Symbols for the currencies Stripe can hand back; unknown codes render as-is.
const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '€', USD: '$', GBP: '£' };

export const currencySymbol = (currency?: string | null): string => {
  const code = (currency || 'EUR').toUpperCase();
  return CURRENCY_SYMBOLS[code] ?? code;
};

// Amount + currency with the symbol ALWAYS after the number ("100,00 €"),
// whatever the active locale would do on its own (en-US puts it in front).
export const formatMoney = (
  amount: number,
  currency?: string | null,
  locale?: string,
): string => {
  let text: string;
  try {
    text = new Intl.NumberFormat(locale || 'fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    text = amount.toFixed(2);
  }
  return `${text} ${currencySymbol(currency)}`;
};
