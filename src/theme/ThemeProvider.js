/**
 * ThemeProvider for Reactive chmlsh
 * A theming system for consistent styling across applications
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, ColorSchemeName } from '../hooks/useColorScheme';
import { lightTheme, darkTheme } from './themes';

// Create theme context
const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

/**
 * ThemeProvider component
 * @param {Object} props - Component props
 * @returns {React.Element} Provider component
 */
export function ThemeProvider({ children, initialTheme, useSystemTheme = true }) {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // Initialize theme based on system preference or initial theme
  const [theme, setThemeState] = useState(() => {
    if (useSystemTheme && systemColorScheme === ColorSchemeName.DARK) {
      return darkTheme;
    }
    
    return initialTheme || lightTheme;
  });
  
  // Update theme when system color scheme changes
  useEffect(() => {
    if (useSystemTheme) {
      setThemeState(systemColorScheme === ColorSchemeName.DARK ? darkTheme : lightTheme);
    }
  }, [systemColorScheme, useSystemTheme]);
  
  // Determine if current theme is dark
  const isDark = theme === darkTheme;
  
  // Set theme function
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeState(isDark ? lightTheme : darkTheme);
  };
  
  // Create context value
  const contextValue = {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme
 * @returns {Object} Theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Hook to get themed styles
 * @param {Function} styleCreator - Function to create styles based on theme
 * @returns {Object} Themed styles
 */
export function useThemedStyles(styleCreator) {
  const { theme } = useTheme();
  return styleCreator(theme);
}

/**
 * Higher-order component to inject theme into a component
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} Wrapped component with theme prop
 */
export function withTheme(Component) {
  return function ThemedComponent(props) {
    const { theme, isDark } = useTheme();
    return <Component {...props} theme={theme} isDark={isDark} />;
  };
}
