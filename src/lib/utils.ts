import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateObj);
}

export function getDealStatusColor(status: string): string {
  const colors: Record<string, string> = {
    LEAD: 'bg-slate-100 text-slate-700',
    ANALYZING: 'bg-blue-100 text-blue-700',
    UNDERWRITING: 'bg-purple-100 text-purple-700',
    SUBMITTED: 'bg-cyan-100 text-cyan-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    FUNDED: 'bg-teal-100 text-teal-700',
    CLOSED: 'bg-gray-100 text-gray-700',
    DEAD: 'bg-red-100 text-red-700',
  };
  return colors[status] || colors.LEAD;
}

export function getDSCRStatus(dscr: number): { status: 'excellent' | 'good' | 'warning' | 'poor'; color: string; label: string } {
  if (dscr >= 1.5) return { status: 'excellent', color: 'text-profit', label: 'Excellent' };
  if (dscr >= 1.25) return { status: 'good', color: 'text-bankReady', label: 'Good' };
  if (dscr >= 1.0) return { status: 'warning', color: 'text-warning', label: 'Marginal' };
  return { status: 'poor', color: 'text-loss', label: 'Below Threshold' };
}

export function getDealScoreColor(score: number): string {
  if (score >= 85) return 'text-profit';
  if (score >= 70) return 'text-bankReady';
  if (score >= 55) return 'text-warning';
  return 'text-loss';
}
