/**
 * useColorScheme hook for Reactive chmlsh
 * A hook to get the user's preferred color scheme (light or dark)
 */

import { useState, useEffect } from 'react';

// Color scheme constants
const ColorSchemeName = {
  LIGHT: 'light',
  DARK: 'dark'
};

/**
 * Hook to get the user's preferred color scheme
 * @returns {string} Current color scheme ('light' or 'dark')
 */
export function useColorScheme() {
  // Check if media query is supported
  const supportsColorScheme = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme)').media !== 'not all';

  // Get initial color scheme
  const getInitialColorScheme = () => {
    if (supportsColorScheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ColorSchemeName.DARK
        : ColorSchemeName.LIGHT;
    }
    
    // Default to light if not supported
    return ColorSchemeName.LIGHT;
  };

  const [colorScheme, setColorScheme] = useState(getInitialColorScheme);

  useEffect(() => {
    if (!supportsColorScheme) {
      return;
    }

    // Create media queries
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)');
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Handle light scheme change
    const handleLightScheme = (event) => {
      if (event.matches) {
        setColorScheme(ColorSchemeName.LIGHT);
      }
    };

    // Handle dark scheme change
    const handleDarkScheme = (event) => {
      if (event.matches) {
        setColorScheme(ColorSchemeName.DARK);
      }
    };

    // Add event listeners
    if (lightQuery.addEventListener) {
      lightQuery.addEventListener('change', handleLightScheme);
      darkQuery.addEventListener('change', handleDarkScheme);
    } else {
      // Fallback for older browsers
      lightQuery.addListener(handleLightScheme);
      darkQuery.addListener(handleDarkScheme);
    }

    return () => {
      // Remove event listeners
      if (lightQuery.removeEventListener) {
        lightQuery.removeEventListener('change', handleLightScheme);
        darkQuery.removeEventListener('change', handleDarkScheme);
      } else {
        // Fallback for older browsers
        lightQuery.removeListener(handleLightScheme);
        darkQuery.removeListener(handleDarkScheme);
      }
    };
  }, [supportsColorScheme]);

  return colorScheme;
}

// Export color scheme constants
export { ColorSchemeName };
