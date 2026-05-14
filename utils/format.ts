import { AppTheme, theme as staticTheme } from '../styles/theme';

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function getStatusColors(status: string, theme: AppTheme = staticTheme) {
  const normalized = status.toLowerCase();

  if (normalized.includes('approved') || normalized.includes('paid') || normalized.includes('present') || normalized.includes('done')) {
    return {
      backgroundColor: theme.colors.successSoft,
      textColor: theme.colors.successText,
      borderColor: theme.colors.success + '2A',
    };
  }

  if (normalized.includes('pending') || normalized.includes('progress') || normalized.includes('half')) {
    return {
      backgroundColor: theme.colors.warningSoft,
      textColor: theme.colors.warningText,
      borderColor: theme.colors.warning + '2A',
    };
  }

  if (normalized.includes('rejected') || normalized.includes('due') || normalized.includes('absent') || normalized.includes('blocked')) {
    return {
      backgroundColor: theme.colors.dangerSoft,
      textColor: theme.colors.dangerText,
      borderColor: theme.colors.danger + '2A',
    };
  }

  return {
    backgroundColor: theme.colors.infoSoft,
    textColor: theme.colors.infoText,
    borderColor: theme.colors.info + '28',
  };
}

export function capFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}