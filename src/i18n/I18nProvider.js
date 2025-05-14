/**
 * I18nProvider for Reactive chmlsh
 * A provider for internationalization
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { AsyncStorage } from '../AsyncStorage';

// Create context
const I18nContext = createContext({
  locale: 'en',
  translations: {},
  t: () => '',
  setLocale: () => {},
  formatNumber: () => '',
  formatDate: () => '',
  formatTime: () => '',
  formatCurrency: () => '',
  formatRelativeTime: () => '',
});

/**
 * I18nProvider component
 * @param {Object} props - Component properties
 * @returns {React.Element} Provider component
 */
const I18nProvider = (props) => {
  const {
    children,
    defaultLocale = 'en',
    translations = {},
    persistLocale = true,
    storageKey = '@ReactiveChmlsh:locale',
    fallback = true,
    onLocaleChange,
  } = props;

  // State for current locale
  const [locale, setLocaleState] = useState(defaultLocale);
  
  // State for loaded translations
  const [loadedTranslations, setLoadedTranslations] = useState(translations);

  // Load saved locale on mount
  useEffect(() => {
    const loadSavedLocale = async () => {
      if (persistLocale) {
        try {
          const savedLocale = await AsyncStorage.getItem(storageKey);
          
          if (savedLocale) {
            setLocaleState(savedLocale);
          }
        } catch (error) {
          console.error('Error loading saved locale:', error);
        }
      }
    };
    
    loadSavedLocale();
  }, [persistLocale, storageKey]);

  // Set locale and save to storage
  const setLocale = useCallback(async (newLocale) => {
    setLocaleState(newLocale);
    
    if (persistLocale) {
      try {
        await AsyncStorage.setItem(storageKey, newLocale);
      } catch (error) {
        console.error('Error saving locale:', error);
      }
    }
    
    if (onLocaleChange) {
      onLocaleChange(newLocale);
    }
  }, [persistLocale, storageKey, onLocaleChange]);

  // Add translations for a locale
  const addTranslations = useCallback((localeKey, newTranslations) => {
    setLoadedTranslations(prevTranslations => ({
      ...prevTranslations,
      [localeKey]: {
        ...(prevTranslations[localeKey] || {}),
        ...newTranslations,
      },
    }));
  }, []);

  // Get translation for a key
  const t = useCallback((key, params = {}, options = {}) => {
    const { defaultValue = key, locale: localeOverride } = options;
    const currentLocale = localeOverride || locale;
    
    // Get translations for current locale
    const localeTranslations = loadedTranslations[currentLocale] || {};
    
    // Get translation
    let translation = localeTranslations[key];
    
    // If translation not found and fallback is enabled, try default locale
    if (!translation && fallback && currentLocale !== defaultLocale) {
      const defaultTranslations = loadedTranslations[defaultLocale] || {};
      translation = defaultTranslations[key];
    }
    
    // If still no translation, use default value
    if (!translation) {
      translation = defaultValue;
    }
    
    // Replace parameters in translation
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return translation;
  }, [locale, loadedTranslations, defaultLocale, fallback]);

  // Format number
  const formatNumber = useCallback((number, options = {}) => {
    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (error) {
      console.error('Error formatting number:', error);
      return number.toString();
    }
  }, [locale]);

  // Format date
  const formatDate = useCallback((date, options = {}) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
      }).format(date instanceof Date ? date : new Date(date));
    } catch (error) {
      console.error('Error formatting date:', error);
      return date.toString();
    }
  }, [locale]);

  // Format time
  const formatTime = useCallback((date, options = {}) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: 'numeric',
        second: options.second !== undefined ? options.second : undefined,
        hour12: options.hour12 !== undefined ? options.hour12 : true,
        ...options,
      }).format(date instanceof Date ? date : new Date(date));
    } catch (error) {
      console.error('Error formatting time:', error);
      return date.toString();
    }
  }, [locale]);

  // Format currency
  const formatCurrency = useCallback((amount, currency = 'USD', options = {}) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        ...options,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return amount.toString();
    }
  }, [locale]);

  // Format relative time
  const formatRelativeTime = useCallback((value, unit, options = {}) => {
    try {
      if (Intl.RelativeTimeFormat) {
        return new Intl.RelativeTimeFormat(locale, {
          numeric: 'auto',
          style: 'long',
          ...options,
        }).format(value, unit);
      } else {
        // Fallback for browsers without RelativeTimeFormat support
        const units = {
          year: 'year',
          quarter: 'quarter',
          month: 'month',
          week: 'week',
          day: 'day',
          hour: 'hour',
          minute: 'minute',
          second: 'second',
        };
        
        const unitStr = units[unit] || unit;
        const absValue = Math.abs(value);
        const plural = absValue !== 1 ? 's' : '';
        
        return value >= 0
          ? `in ${absValue} ${unitStr}${plural}`
          : `${absValue} ${unitStr}${plural} ago`;
      }
    } catch (error) {
      console.error('Error formatting relative time:', error);
      return value.toString();
    }
  }, [locale]);

  // Context value
  const contextValue = {
    locale,
    translations: loadedTranslations,
    t,
    setLocale,
    addTranslations,
    formatNumber,
    formatDate,
    formatTime,
    formatCurrency,
    formatRelativeTime,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export { I18nProvider, I18nContext };
