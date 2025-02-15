
import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';


interface ThemeContextProps {
    theme: 'light' | 'dark';
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}


const ThemeContext = createContext<ThemeContextProps>({
    theme: 'light',
    loading: true,
    setLoading: () => { },
    setTheme: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    return (
        <ThemeContext.Provider
            value={{
                theme,
                loading,
                setTheme,
                setLoading,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
