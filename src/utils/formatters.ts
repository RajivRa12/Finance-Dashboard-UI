export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function monthLabel(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(date))
}

export function getMonthKey(date: string) {
  return date.slice(0, 7)
}
