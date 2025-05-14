/**
 * useAppState hook for Reactive chmlsh
 * A hook to track app state (active, background, inactive)
 */

import { useState, useEffect } from 'react';

// App state constants
const AppStateStatus = {
  ACTIVE: 'active',
  BACKGROUND: 'background',
  INACTIVE: 'inactive'
};

/**
 * Hook to track app state
 * @returns {string} Current app state
 */
export function useAppState() {
  const [appState, setAppState] = useState(AppStateStatus.ACTIVE);

  useEffect(() => {
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setAppState(AppStateStatus.ACTIVE);
      } else {
        setAppState(AppStateStatus.BACKGROUND);
      }
    };

    // Handle window focus/blur
    const handleFocus = () => {
      setAppState(AppStateStatus.ACTIVE);
    };

    const handleBlur = () => {
      setAppState(AppStateStatus.INACTIVE);
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return appState;
}

// Export app state constants
export { AppStateStatus };
