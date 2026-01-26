/**
 * Format utilities for consistent number/currency formatting
 * Uses explicit locale to prevent hydration mismatch between server and client
 */

const LOCALE = 'en-US';

/**
 * Format a number with consistent locale to prevent hydration mismatch
 */
export function formatNumber(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat(LOCALE, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format a currency value with consistent locale
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format a percentage value
 */
export function formatPercent(value: number, decimals: number = 1): string {
    return new Intl.NumberFormat(LOCALE, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100);
}

/**
 * Format a date with consistent locale
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(LOCALE, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    }).format(d);
}
