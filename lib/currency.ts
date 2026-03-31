export const CURRENCY_MAP: Record<string, string> = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£',
};

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCurrencySymbol(currency: string = 'USD') {
  return CURRENCY_MAP[currency] || '$';
}
