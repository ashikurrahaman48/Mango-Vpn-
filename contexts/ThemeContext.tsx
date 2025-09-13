
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

export const themes = ['mango', 'dark', 'light', 'material', 'github'] as const;
export type Theme = typeof themes[number];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: readonly Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('mango');

  useEffect(() => {
    const storedTheme = localStorage.getItem('vpn-theme') as Theme;
    if (storedTheme && themes.includes(storedTheme)) {
      setThemeState(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'mango');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('vpn-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const value = useMemo(() => ({ theme, setTheme, availableThemes: themes }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
