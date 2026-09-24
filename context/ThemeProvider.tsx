import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, FC } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

const isTheme = (value: string | null | undefined): value is Theme =>
    value === 'light' || value === 'dark';

interface ThemeContextProps {
    theme: Theme;
    /** Persists the choice to AsyncStorage and updates the app immediately. */
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: 'light',
    setTheme: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('light');

    useEffect(() => {
        let cancelled = false;

        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (cancelled) return;

                if (isTheme(storedTheme)) {
                    setThemeState(storedTheme);
                    return;
                }

                const systemTheme = Appearance.getColorScheme();
                setThemeState(isTheme(systemTheme) ? systemTheme : 'light');
            } catch (error) {
                console.error('[theme] failed to load stored theme:', error);
            }
        };

        loadTheme();
        return () => { cancelled = true; };
    }, []);

    // Persisting lives here so every caller gets it, instead of the settings
    // screen being the only place that remembers to write to AsyncStorage.
    const value = useMemo<ThemeContextProps>(() => ({
        theme,
        setTheme: (next: Theme) => {
            setThemeState(next);
            AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch((error) =>
                console.error('[theme] failed to persist theme:', error),
            );
        },
    }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
