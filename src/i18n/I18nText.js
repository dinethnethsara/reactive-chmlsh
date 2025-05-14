/**
 * I18nText component for Reactive chmlsh
 * A component for displaying translated text
 */

import React from 'react';
import { Text } from '../components/Text';
import { useI18n } from './useI18n';

/**
 * I18nText component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const I18nText = (props) => {
  const {
    i18nKey,
    defaultValue,
    params = {},
    style,
    children,
    ...otherProps
  } = props;

  const { t } = useI18n();
  
  // If i18nKey is provided, use it to get translation
  if (i18nKey) {
    return (
      <Text style={style} {...otherProps}>
        {t(i18nKey, params, { defaultValue })}
      </Text>
    );
  }
  
  // Otherwise, render children
  return (
    <Text style={style} {...otherProps}>
      {children}
    </Text>
  );
};

export { I18nText };
