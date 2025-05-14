/**
 * useBackButton hook for Reactive chmlsh
 * A hook to handle back button presses
 */

import { useEffect } from 'react';
import { Platform } from '../Platform';

/**
 * Hook to handle back button presses
 * @param {Function} callback - Function to call when back button is pressed
 */
export function useBackButton(callback) {
  useEffect(() => {
    // Handle hardware back button on Android
    if (Platform.OS === Platform.OS.ANDROID && typeof document !== 'undefined') {
      const handleBackButton = (event) => {
        if (event.key === 'Escape' || event.key === 'Backspace') {
          // Prevent default only if the target is the document body
          // This allows normal backspace behavior in input fields
          if (event.target === document.body) {
            event.preventDefault();
            callback();
            return false;
          }
        }
      };

      document.addEventListener('keydown', handleBackButton);
      
      return () => {
        document.removeEventListener('keydown', handleBackButton);
      };
    }
    
    // Handle browser back button
    if (typeof window !== 'undefined' && window.history) {
      const handlePopState = () => {
        callback();
        // Push a new state to prevent actual navigation
        window.history.pushState(null, '');
      };
      
      // Push initial state
      window.history.pushState(null, '');
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [callback]);
}
