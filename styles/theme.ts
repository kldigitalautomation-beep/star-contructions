import { Appearance, Platform } from 'react-native';

// ─── Star Constructions Brand Palette ───────────────────────────────────────
// Logo: deep navy #163A7C  |  gold/amber #F5A623  |  orange #E8870A
// ─────────────────────────────────────────────────────────────────────────────

const isDark = Appearance.getColorScheme() === 'dark';
const gradient = (...colors: [string, string, ...string[]]) => colors;

const cardShadowNone = {
  shadowColor: 'transparent',
  shadowOpacity: 0,
  shadowRadius: 0,
  shadowOffset: { width: 0, height: 0 },
  elevation: 0,
};

const cardShadowTokens = Platform.OS === 'android'
  ? { sm: cardShadowNone, md: cardShadowNone, lg: cardShadowNone }
  : {
      sm: {
        shadowColor: isDark ? '#000000' : '#163A7C',
        shadowOpacity: isDark ? 0.28 : 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 0,
      },
      md: {
        shadowColor: isDark ? '#000000' : '#163A7C',
        shadowOpacity: isDark ? 0.36 : 0.10,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 0,
      },
      lg: {
        shadowColor: isDark ? '#000000' : '#163A7C',
        shadowOpacity: isDark ? 0.44 : 0.14,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 14 },
        elevation: 0,
      },
    };

const controlShadowTokens = {
  sm: cardShadowNone,
  md: {
    shadowColor: isDark ? '#000000' : '#163A7C',
    shadowOpacity: isDark ? 0.28 : 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  lg: cardShadowNone,
};

// ─── Light Palette (Star Constructions Brand) ─────────────────────────────
const lightPalette = {
  // Brand
  primary: '#163A7C',          // deep navy
  primaryDark: '#0D2456',      // darker navy
  primaryLight: '#2D5AA8',     // mid navy
  primarySoft: 'rgba(22,58,124,0.10)',
  primaryMuted: 'rgba(22,58,124,0.18)',
  accent: '#F5A623',           // gold/amber
  accentDark: '#C47A00',
  accentSoft: 'rgba(245,166,35,0.14)',
  // Backgrounds
  background: '#EEF2FA',
  backgroundAlt: '#E3EAF6',
  surface: '#FFFFFF',
  surfaceVariant: '#F4F7FD',
  surfaceElevated: '#FFFFFF',
  // Borders
  border: '#DDE6F5',
  borderStrong: '#BDD0EE',
  divider: '#EAF0FA',
  // Text
  text: '#0D1B35',
  textSecondary: '#243258',
  textMuted: '#6272A0',
  textLight: '#9AA7C9',
  textInverse: '#FFFFFF',
  // Semantic
  success: '#00B96B',
  successSoft: 'rgba(0,185,107,0.12)',
  successText: '#006B41',
  warning: '#F5A623',
  warningSoft: 'rgba(245,166,35,0.14)',
  warningText: '#9A6200',
  danger: '#E5343A',
  dangerSoft: 'rgba(229,52,58,0.12)',
  dangerText: '#A5181E',
  info: '#2D5AA8',
  infoSoft: 'rgba(45,90,168,0.12)',
  infoText: '#163A7C',
  // Tab / Overlay
  overlay: 'rgba(13,27,53,0.50)',
  overlayLight: 'rgba(255,255,255,0.92)',
  tabBar: '#FFFFFF',
  tabBarBorder: '#DDE6F5',
};

// ─── Dark Palette ──────────────────────────────────────────────────────────
const darkPalette = {
  primary: '#5B8BF5',
  primaryDark: '#3460CC',
  primaryLight: '#8AAEFF',
  primarySoft: 'rgba(91,139,245,0.18)',
  primaryMuted: 'rgba(91,139,245,0.30)',
  accent: '#F5A623',
  accentDark: '#C47A00',
  accentSoft: 'rgba(245,166,35,0.20)',
  background: '#080E1A',
  backgroundAlt: 'rgba(14,22,40,0.80)',
  surface: 'rgba(16,24,42,0.92)',
  surfaceVariant: 'rgba(14,20,36,0.72)',
  surfaceElevated: 'rgba(24,34,60,0.92)',
  border: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',
  divider: 'rgba(255,255,255,0.07)',
  text: '#EEF2FC',
  textSecondary: '#C2D0EE',
  textMuted: '#8898C2',
  textLight: '#5D6E96',
  textInverse: '#080E1A',
  success: '#27D97A',
  successSoft: 'rgba(39,217,122,0.16)',
  successText: '#7DEBB4',
  warning: '#F5A623',
  warningSoft: 'rgba(245,166,35,0.18)',
  warningText: '#FAD07A',
  danger: '#FF5F5A',
  dangerSoft: 'rgba(255,95,90,0.16)',
  dangerText: '#FFB4AE',
  info: '#5B8BF5',
  infoSoft: 'rgba(91,139,245,0.16)',
  infoText: '#A6BEFF',
  overlay: 'rgba(2,6,14,0.72)',
  overlayLight: 'rgba(255,255,255,0.08)',
  tabBar: 'rgba(14,20,38,0.96)',
  tabBarBorder: 'rgba(255,255,255,0.10)',
};

const palette = isDark ? darkPalette : lightPalette;

export const theme = {
  isDark,
  statusBarStyle: isDark ? 'light' : 'dark',
  colors: palette,
  brand: {
    navy: '#163A7C',
    navyDark: '#0D2456',
    gold: '#F5A623',
    goldDark: '#C47A00',
    orange: '#E8870A',
  },
  card: {
    border: isDark ? 'rgba(255,255,255,0.11)' : '#DDE6F5',
    accentBorder: isDark ? 'rgba(91,139,245,0.30)' : 'rgba(22,58,124,0.22)',
    sectionBorder: isDark ? 'rgba(255,255,255,0.07)' : '#EAF0FA',
    shadow: cardShadowTokens,
  },
  control: {
    border: isDark ? 'rgba(255,255,255,0.14)' : '#BDD0EE',
    inputBorder: isDark ? 'rgba(255,255,255,0.12)' : '#C8D8EF',
    accentBorder: isDark ? 'rgba(91,139,245,0.36)' : 'rgba(22,58,124,0.30)',
    shadow: controlShadowTokens,
  },

  gradients: {
    appBackground: isDark
      ? gradient('#060C18', '#0A1428', '#0E1A30')
      : gradient('#EEF2FA', '#F4F7FD', '#EEF2FA'),
    hero: isDark
      ? gradient('#163A7C', '#0D2456', '#080E1A')
      : gradient('#163A7C', '#1D4A96', '#2D5AA8'),
    heroOverlay: isDark
      ? gradient('rgba(8,14,26,0.62)', 'rgba(8,14,26,0.20)')
      : gradient('rgba(22,58,124,0.82)', 'rgba(13,36,86,0.94)'),
    card: isDark
      ? gradient('rgba(24,34,60,0.90)', 'rgba(16,24,42,0.86)')
      : gradient('#FFFFFF', '#F8FBFF'),
    cardAccent: isDark
      ? gradient('rgba(91,139,245,0.16)', 'rgba(16,24,42,0.86)')
      : gradient('rgba(22,58,124,0.06)', '#FFFFFF'),
    cardGold: isDark
      ? gradient('rgba(245,166,35,0.16)', 'rgba(16,24,42,0.86)')
      : gradient('rgba(245,166,35,0.08)', '#FFFFFF'),
    primaryButton: isDark
      ? gradient('#2D5AA8', '#163A7C')
      : gradient('#1D4A96', '#163A7C'),
    accentButton: gradient('#F5A623', '#E8870A'),
    dangerButton: isDark
      ? gradient('#FF7B72', '#E5343A')
      : gradient('#F04040', '#E5343A'),
    header: isDark
      ? gradient('rgba(14,20,38,0.94)', 'rgba(10,16,28,0.88)')
      : gradient('#FFFFFF', '#F8FBFF'),
    tabBar: isDark
      ? gradient('rgba(14,20,38,0.98)', 'rgba(10,16,28,0.98)')
      : gradient('#FFFFFF', '#F8FBFF'),
    loginBrand: gradient('#163A7C', '#1D4A96', '#0D2456'),
  },

  glass: {
    tint: isDark ? ('dark' as const) : ('light' as const),
    cardIntensity: isDark ? 30 : 40,
    headerIntensity: isDark ? 40 : 50,
    navIntensity: isDark ? 38 : 48,
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 44,
  },

  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
    full: 999,
  },

  typography: {
    hero: 34,
    title: 26,
    section: 20,
    subtitle: 17,
    body: 15,
    small: 13,
    caption: 12,
    micro: 11,
    lineHeightTitle: 34,
    lineHeightBody: 22,
    lineHeightCaption: 17,
  },

  shadow: {
    sm: {
      shadowColor: isDark ? '#000000' : '#163A7C',
      shadowOpacity: isDark ? 0.30 : 0.09,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    md: {
      shadowColor: isDark ? '#000000' : '#163A7C',
      shadowOpacity: isDark ? 0.40 : 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    lg: {
      shadowColor: isDark ? '#000000' : '#163A7C',
      shadowOpacity: isDark ? 0.50 : 0.16,
      shadowRadius: 30,
      shadowOffset: { width: 0, height: 14 },
      elevation: 14,
    },
  },
} as const;

// Legacy flat shadow (used by some components)
export const cardShadow = theme.card.shadow.md;

export const getAccentCardBorder = (accent: string) => `${accent}${isDark ? '40' : '28'}`;

export const roleAccent = {
  overallAdmin: '#163A7C',   // brand navy
  paymentManager: '#00B96B', // green
  leadManager: '#F5A623',    // brand gold
  staff: '#2D5AA8',          // mid navy
} as const;

export const roleAccentSoft = {
  overallAdmin: isDark ? 'rgba(22,58,124,0.24)' : 'rgba(22,58,124,0.10)',
  paymentManager: isDark ? 'rgba(0,185,107,0.22)' : 'rgba(0,185,107,0.10)',
  leadManager: isDark ? 'rgba(245,166,35,0.24)' : 'rgba(245,166,35,0.12)',
  staff: isDark ? 'rgba(45,90,168,0.22)' : 'rgba(45,90,168,0.10)',
} as const;