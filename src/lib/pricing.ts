// Cleaning price breakdown — mirrors the backend escrow model so the UI never
// shows a total different from what the host is actually charged.
//
// Backend (payment.service.ts):
//   amount        = accommodation.cleaningRate            ← what the host pays
//   platformFee   = round(amount * FEE_PERCENT / 100)     ← platform keeps this
//   cleanerAmount = amount - platformFee                  ← paid out to the cleaner
//
// So on screen:  Cleaning Service (cleanerAmount) + Service Fee (platformFee) = Total (amount)

// Keep in sync with backend `config.platform_fee_percent` (default 5).
export const PLATFORM_FEE_PERCENT = 5;

export interface SchedulePrice {
  /** Base rate the host pays (cleaningRate / agreed price per cleaning). */
  total: number;
  /** Platform's cut, taken out of the base. */
  serviceFee: number;
  /** What actually reaches the cleaner. */
  cleaningService: number;
}

export const computeSchedulePrice = (
  pricePerCleaning?: number | null,
  cleaningRate?: number | null,
): SchedulePrice => {
  const base = Number(pricePerCleaning ?? cleaningRate ?? 0) || 0;
  const serviceFee = Math.round(((base * PLATFORM_FEE_PERCENT) / 100) * 100) / 100;
  return {
    total: base,
    serviceFee,
    cleaningService: Math.round((base - serviceFee) * 100) / 100,
  };
};

// French-style amount used across the schedule flow. Whole euros render without
// centimes ("250 €"); only genuine fractional prices keep the decimals ("2,50 €").
export const formatEuro = (amount: number): string => {
  const rounded = Math.round(amount * 100) / 100;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace('.', ',');
  return `${text} €`;
};
