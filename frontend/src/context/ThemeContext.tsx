import { type ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ThemeContext } from '../hooks/useThemeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const { theme, toggle } = useTheme();

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}