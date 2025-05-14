/**
 * useI18n hook for Reactive chmlsh
 * A hook for accessing internationalization functions
 */

import { useContext } from 'react';
import { I18nContext } from './I18nProvider';

/**
 * Hook for accessing internationalization functions
 * @returns {Object} I18n functions and values
 */
const useI18n = () => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
};

export { useI18n };
