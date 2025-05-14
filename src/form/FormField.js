/**
 * FormField component for Reactive chmlsh
 * A component for rendering form fields with validation
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from '../components/View';
import { Text } from '../components/Text';
import { useField } from './useField';

/**
 * FormField component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const FormField = (props) => {
  const {
    name,
    label,
    component: Component,
    helperText,
    errorStyle,
    labelStyle,
    helperTextStyle,
    containerStyle,
    showError = true,
    required = false,
    ...otherProps
  } = props;

  // Get field state and functions
  const {
    field,
    meta: { error, touched },
    getInputProps,
  } = useField(name);

  // Determine if error should be shown
  const showErrorMessage = showError && error && touched;

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 4,
    },
    error: {
      color: '#F44336',
      fontSize: 12,
      marginTop: 4,
    },
    helperText: {
      fontSize: 12,
      color: '#757575',
      marginTop: 4,
    },
    required: {
      color: '#F44336',
      marginLeft: 2,
    },
  });

  // Merge styles
  const containerStyleMerged = StyleSheet.flatten(defaultStyles.container, containerStyle);
  const labelStyleMerged = StyleSheet.flatten(defaultStyles.label, labelStyle);
  const errorStyleMerged = StyleSheet.flatten(defaultStyles.error, errorStyle);
  const helperTextStyleMerged = StyleSheet.flatten(defaultStyles.helperText, helperTextStyle);

  return (
    <View style={containerStyleMerged}>
      {label && (
        <Text style={labelStyleMerged}>
          {label}
          {required && <Text style={defaultStyles.required}>*</Text>}
        </Text>
      )}
      
      <Component
        {...getInputProps(otherProps)}
        error={!!error && touched}
      />
      
      {showErrorMessage && (
        <Text style={errorStyleMerged}>{error}</Text>
      )}
      
      {helperText && !showErrorMessage && (
        <Text style={helperTextStyleMerged}>{helperText}</Text>
      )}
    </View>
  );
};

export { FormField };
