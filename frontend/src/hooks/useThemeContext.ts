import { createContext, useContext } from 'react';

interface ThemeContextType {
	theme: 'light' | 'dark';
	toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function useThemeContext() {
	const context = useContext(ThemeContext);
	if (!context)
		throw new Error('useThemeContext must be used within ThemeProvider');
	return context;
}
