
import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import ThemedButton from '../Theme/themedButton/temedButton';


interface ThemeContextProps {
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
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
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            const systemTheme = Appearance.getColorScheme(); // Detectar tema del sistema
            setTheme(systemTheme || 'light');
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
