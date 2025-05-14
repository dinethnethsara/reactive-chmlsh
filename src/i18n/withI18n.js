/**
 * withI18n HOC for Reactive chmlsh
 * A higher-order component for injecting internationalization functions
 */

import React from 'react';
import { useI18n } from './useI18n';

/**
 * Higher-order component for injecting internationalization functions
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} Wrapped component with i18n props
 */
const withI18n = (Component) => {
  const WithI18n = (props) => {
    const i18n = useI18n();
    
    return <Component {...props} {...i18n} />;
  };
  
  WithI18n.displayName = `withI18n(${Component.displayName || Component.name || 'Component'})`;
  
  return WithI18n;
};

export { withI18n };
