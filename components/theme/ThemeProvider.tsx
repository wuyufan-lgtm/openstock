'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const readDom = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

const apply = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
};

/**
 * The theme lives on <html> as a class, and the inline script in the document head has already
 * put it there before the first paint. So this provider only has to keep React in step with the
 * DOM — it never decides the first theme itself, which is what keeps the page from flashing.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

    useEffect(() => {
        setThemeState(readDom());

        // Another tab switched themes: follow it, without writing storage back.
        const onStorage = (event: StorageEvent) => {
            if (event.key !== THEME_STORAGE_KEY) return;
            const next: Theme = event.newValue === 'light' ? 'light' : 'dark';
            apply(next);
            setThemeState(next);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const setTheme = useCallback((next: Theme) => {
        apply(next);
        setThemeState(next);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
            // Storage blocked (private mode): the theme still applies to this page.
        }
    }, []);

    const value = useMemo<ThemeContextValue>(
        () => ({ theme, setTheme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }),
        [theme, setTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
    return context;
}
