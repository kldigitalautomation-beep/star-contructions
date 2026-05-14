import { Appearance, Platform } from 'react-native';

// ─── Star Constructions Brand Palette ───────────────────────────────────────
// Logo: deep navy #163A7C  |  gold/amber #F5A623  |  orange #E8870A
// ─────────────────────────────────────────────────────────────────────────────

const gradient = (...colors: [string, string, ...string[]]) => colors;

const cardShadowNone = {
  shadowColor: 'transparent',
  shadowOpacity: 0,
  shadowRadius: 0,
  shadowOffset: { width: 0, height: 0 },
  elevation: 0,
};

// ─── Light Palette (Star Constructions Brand) ─────────────────────────────
const lightPalette = {
  // Brand
  primary: '#163A7C',
  primaryDark: '#0D2456',
  primaryLight: '#2D5AA8',
  primarySoft: 'rgba(22,58,124,0.10)',
  primaryMuted: 'rgba(22,58,124,0.20)',
  accent: '#F5A623',
  accentDark: '#C47A00',
  accentSoft: 'rgba(245,166,35,0.14)',
  // Backgrounds
  background: '#EAF0FA',
  backgroundAlt: '#DDE8F6',
  surface: '#FFFFFF',
  surfaceVariant: '#F2F6FD',
  surfaceElevated: '#FFFFFF',
  // Borders
  border: '#D8E5F5',
  borderStrong: '#B8CCEA',
  divider: '#E8EFF9',
  // Text
  text: '#0A1628',
  textSecondary: '#1E3060',
  textMuted: '#5A6E9A',
  textLight: '#8A9DC0',
  textInverse: '#FFFFFF',
  // Semantic
  success: '#00A85A',
  successSoft: 'rgba(0,168,90,0.10)',
  successText: '#005A32',
  warning: '#E69200',
  warningSoft: 'rgba(230,146,0,0.12)',
  warningText: '#7A5200',
  danger: '#D42A30',
  dangerSoft: 'rgba(212,42,48,0.10)',
  dangerText: '#8C0E14',
  info: '#2D5AA8',
  infoSoft: 'rgba(45,90,168,0.10)',
  infoText: '#163A7C',
  // Tab / Overlay
  overlay: 'rgba(10,22,40,0.52)',
  overlayLight: 'rgba(255,255,255,0.94)',
  tabBar: '#FFFFFF',
  tabBarBorder: '#D8E5F5',
  // Header-specific
  headerBg: '#163A7C',
  headerText: '#FFFFFF',
  headerSubtext: 'rgba(255,255,255,0.82)',
  // Extra tokens
  inputBg: '#F8FBFF',
  chipActive: '#163A7C',
  tabActiveIndicator: 'rgba(22,58,124,0.10)',
};

// ─── Dark Palette ──────────────────────────────────────────────────────────
const darkPalette = {
  primary: '#7AAAFF',
  primaryDark: '#2252B8',
  primaryLight: '#B8CFFF',
  primarySoft: 'rgba(122,170,255,0.22)',
  primaryMuted: 'rgba(122,170,255,0.44)',
  accent: '#F5A623',
  accentDark: '#D58A12',
  accentSoft: 'rgba(245,166,35,0.24)',
  background: '#060D1C',
  backgroundAlt: '#0C1628',
  surface: '#101E3C',
  surfaceVariant: '#0A1428',
  surfaceElevated: '#182642',
  border: 'rgba(255,255,255,0.18)',
  borderStrong: 'rgba(255,255,255,0.34)',
  divider: 'rgba(255,255,255,0.10)',
  text: '#EEF4FF',
  textSecondary: '#C8D8F4',
  textMuted: '#8EA8D8',
  textLight: '#5F7AAE',
  textInverse: '#060D1C',
  success: '#2EE87A',
  successSoft: 'rgba(46,232,122,0.16)',
  successText: '#7FF5B0',
  warning: '#F5A623',
  warningSoft: 'rgba(245,166,35,0.20)',
  warningText: '#FFD480',
  danger: '#FF6B6B',
  dangerSoft: 'rgba(255,107,107,0.18)',
  dangerText: '#FFBCBC',
  info: '#7AAAFF',
  infoSoft: 'rgba(122,170,255,0.16)',
  infoText: '#BDD4FF',
  overlay: 'rgba(2,6,14,0.82)',
  overlayLight: 'rgba(255,255,255,0.10)',
  tabBar: '#0D1B38',
  tabBarBorder: 'rgba(122,170,255,0.20)',
  // Header-specific
  headerBg: '#0A1836',
  headerText: '#EEF4FF',
  headerSubtext: 'rgba(200,216,244,0.88)',
  // Extra tokens
  inputBg: '#0C1830',
  chipActive: '#7AAAFF',
  tabActiveIndicator: 'rgba(122,170,255,0.18)',
};

// ─── Build Theme ──────────────────────────────────────────────────────────
export function buildTheme(isDark: boolean) {
  const palette = isDark ? darkPalette : lightPalette;

  const cardShadowTokens = Platform.OS === 'android'
    ? {
        sm: { elevation: 3, shadowColor: isDark ? '#000000' : '#163A7C' },
        md: { elevation: 6, shadowColor: isDark ? '#000000' : '#163A7C' },
        lg: { elevation: 12, shadowColor: isDark ? '#000000' : '#163A7C' },
      }
    : {
        sm: {
          shadowColor: isDark ? '#000000' : '#163A7C',
          shadowOpacity: isDark ? 0.32 : 0.09,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
          elevation: 0,
        },
        md: {
          shadowColor: isDark ? '#000000' : '#163A7C',
          shadowOpacity: isDark ? 0.44 : 0.12,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 8 },
          elevation: 0,
        },
        lg: {
          shadowColor: isDark ? '#000000' : '#163A7C',
          shadowOpacity: isDark ? 0.54 : 0.16,
          shadowRadius: 32,
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

  return {
    isDark,
    statusBarStyle: (isDark ? 'light' : 'dark') as 'light' | 'dark',
    colors: palette,
    brand: {
      navy: '#163A7C',
      navyDark: '#0D2456',
      gold: '#F5A623',
      goldDark: '#C47A00',
      orange: '#E8870A',
    },
    card: {
      border: isDark ? 'rgba(255,255,255,0.14)' : '#D8E5F5',
      accentBorder: isDark ? 'rgba(122,170,255,0.42)' : 'rgba(22,58,124,0.24)',
      sectionBorder: isDark ? 'rgba(255,255,255,0.10)' : '#E8EFF9',
      shadow: cardShadowTokens,
    },
    control: {
      border: isDark ? 'rgba(255,255,255,0.26)' : '#B8CCEA',
      inputBorder: isDark ? 'rgba(255,255,255,0.22)' : '#C0D0EC',
      accentBorder: isDark ? 'rgba(122,170,255,0.46)' : 'rgba(22,58,124,0.32)',
      shadow: controlShadowTokens,
    },
    gradients: {
      appBackground: isDark
        ? gradient('#060D1C', '#0A1628', '#0E1D3A')
        : gradient('#EAF0FA', '#F4F7FD', '#EAF0FA'),
      hero: isDark
        ? gradient('#163A7C', '#2252B8', '#060D1C')
        : gradient('#163A7C', '#1D4A96', '#2D5AA8'),
      heroOverlay: isDark
        ? gradient('rgba(6,13,28,0.60)', 'rgba(6,13,28,0.24)')
        : gradient('rgba(22,58,124,0.84)', 'rgba(13,36,86,0.96)'),
      card: isDark
        ? gradient('#101E3C', '#0C1830')
        : gradient('#FFFFFF', '#F8FCFF'),
      cardAccent: isDark
        ? gradient('rgba(122,170,255,0.14)', '#0C1830')
        : gradient('rgba(22,58,124,0.05)', '#FFFFFF'),
      cardGold: isDark
        ? gradient('rgba(245,166,35,0.18)', '#0C1830')
        : gradient('rgba(245,166,35,0.07)', '#FFFFFF'),
      primaryButton: isDark
        ? gradient('#4B84F0', '#2252B8')
        : gradient('#1D4A96', '#163A7C'),
      accentButton: gradient('#F5A623', '#E8870A'),
      dangerButton: isDark
        ? gradient('#FF6B6B', '#CC2A2F')
        : gradient('#F04040', '#D42A30'),
      header: isDark
        ? gradient('#0A1836', '#060E22')
        : gradient('#163A7C', '#1B4494'),
      screenHeader: isDark
        ? gradient('#0D1E46', '#07122C')
        : gradient('#163A7C', '#1B4494', '#0D2456'),
      tabBar: isDark
        ? gradient('#0D1B38', '#08122C')
        : gradient('#FFFFFF', '#F6FAFF'),
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
    roleAccentSoft: {
      overallAdmin: isDark ? 'rgba(122,170,255,0.20)' : 'rgba(22,58,124,0.10)',
      paymentManager: isDark ? 'rgba(46,232,122,0.18)' : 'rgba(0,168,90,0.10)',
      leadManager: isDark ? 'rgba(245,166,35,0.22)' : 'rgba(245,166,35,0.12)',
      staff: isDark ? 'rgba(122,170,255,0.16)' : 'rgba(45,90,168,0.10)',
    },
    getAccentCardBorder: (accent: string) => `${accent}${isDark ? '44' : '28'}`,
  };
}

export type AppTheme = ReturnType<typeof buildTheme>;

// ─── Static backward-compat export (used at module load; apps should prefer useAppTheme()) ──
const _initialIsDark = Appearance.getColorScheme() === 'dark';
export const theme = buildTheme(_initialIsDark);

// Legacy flat shadow (used by some components)
export const cardShadow = theme.card.shadow.md;

export const getAccentCardBorder = (accent: string) => `${accent}${_initialIsDark ? '44' : '28'}`;

export const roleAccent = {
  overallAdmin: '#163A7C',   // brand navy
  paymentManager: '#00B96B', // green
  leadManager: '#F5A623',    // brand gold
  staff: '#2D5AA8',          // mid navy
} as const;

export const roleAccentSoft = {
  overallAdmin: _initialIsDark ? 'rgba(122,170,255,0.20)' : 'rgba(22,58,124,0.10)',
  paymentManager: _initialIsDark ? 'rgba(46,232,122,0.18)' : 'rgba(0,168,90,0.10)',
  leadManager: _initialIsDark ? 'rgba(245,166,35,0.22)' : 'rgba(245,166,35,0.12)',
  staff: _initialIsDark ? 'rgba(122,170,255,0.16)' : 'rgba(45,90,168,0.10)',
} as const;