/**
 * Centralized Marine Navigation & Safety Status Color System
 * Provides consistent SAFE (Green), CAUTION (Yellow/Amber), and AVOID (Red)
 * tokens, classes, and helpers across all SAMUDRA AI cards and views.
 */

export type SafetyStatus = 'SAFE' | 'CAUTION' | 'AVOID';

export interface SafetyStatusTheme {
  status: SafetyStatus;
  // Dots & small indicators
  dotClass: string;
  // Badge background, border & text (subtle polished tint)
  badgeClass: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  // Glow shadow effects
  glowClass: string;
  // Card border accents & selected rings
  cardBorderHover: string;
  cardSelectedBorder: string;
  cardSelectedRing: string;
  cardSelectedShadow: string;
  // Icon colors
  iconColorClass: string;
  // Accent colors for typography
  accentTextClass: string;
}

export const SAFETY_STATUS_THEMES: Record<SafetyStatus, SafetyStatusTheme> = {
  SAFE: {
    status: 'SAFE',
    dotClass: 'bg-emerald-400',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.18)]',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.22)]',
    cardBorderHover: 'hover:border-emerald-500/50',
    cardSelectedBorder: 'border-emerald-500/90',
    cardSelectedRing: 'ring-1 ring-emerald-400/50',
    cardSelectedShadow: 'shadow-[0_0_20px_rgba(16,185,129,0.18)]',
    iconColorClass: 'text-emerald-400',
    accentTextClass: 'text-emerald-300',
  },
  CAUTION: {
    status: 'CAUTION',
    dotClass: 'bg-amber-400',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.18)]',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_12px_rgba(245,158,11,0.22)]',
    cardBorderHover: 'hover:border-amber-500/50',
    cardSelectedBorder: 'border-amber-500/90',
    cardSelectedRing: 'ring-1 ring-amber-400/50',
    cardSelectedShadow: 'shadow-[0_0_20px_rgba(245,158,11,0.18)]',
    iconColorClass: 'text-amber-400',
    accentTextClass: 'text-amber-300',
  },
  AVOID: {
    status: 'AVOID',
    dotClass: 'bg-rose-500',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.18)]',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    glowClass: 'shadow-[0_0_12px_rgba(244,63,94,0.22)]',
    cardBorderHover: 'hover:border-rose-500/50',
    cardSelectedBorder: 'border-rose-500/90',
    cardSelectedRing: 'ring-1 ring-rose-400/50',
    cardSelectedShadow: 'shadow-[0_0_20px_rgba(244,63,94,0.18)]',
    iconColorClass: 'text-rose-400',
    accentTextClass: 'text-rose-300',
  }
};

/**
 * Normalize any input string to standard SafetyStatus
 */
export function normalizeSafetyStatus(status?: string | null): SafetyStatus {
  if (!status) return 'SAFE';
  const clean = status.trim().toUpperCase();
  if (clean.includes('AVOID') || clean.includes('DANGER') || clean.includes('CRITICAL')) return 'AVOID';
  if (clean.includes('CAUTION') || clean.includes('MODERATE') || clean.includes('WARNING')) return 'CAUTION';
  return 'SAFE';
}

/**
 * Retrieve unified SafetyStatusTheme for any status
 */
export function getSafetyStatusTheme(status?: string | null): SafetyStatusTheme {
  const norm = normalizeSafetyStatus(status);
  return SAFETY_STATUS_THEMES[norm];
}
