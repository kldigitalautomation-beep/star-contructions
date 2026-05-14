import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { AppTheme, buildTheme } from '../styles/theme';

interface ThemeContextValue {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => Appearance.getColorScheme() === 'dark');

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      Appearance.setColorScheme(next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}

export type { AppTheme };
