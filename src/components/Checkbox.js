/**
 * Checkbox component for Reactive chmlsh
 * A checkbox component for form inputs
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';
import { Text } from './Text';

/**
 * Checkbox component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Checkbox = (props) => {
  const {
    value = false,
    disabled = false,
    onValueChange,
    label,
    color = '#2196F3',
    size = 20,
    style,
    labelStyle,
    ...otherProps
  } = props;

  // Default styles for Checkbox container
  const defaultContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  // Default styles for Checkbox
  const defaultCheckboxStyle = {
    width: size,
    height: size,
    borderWidth: 2,
    borderColor: value ? color : '#757575',
    borderRadius: 2,
    backgroundColor: value ? color : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  };

  // Default styles for label
  const defaultLabelStyle = {
    fontSize: 16,
    color: '#000000',
  };

  // Merge styles
  const mergedContainerStyle = StyleSheet.flatten(defaultContainerStyle, style);
  const mergedCheckboxStyle = StyleSheet.flatten(defaultCheckboxStyle);
  const mergedLabelStyle = StyleSheet.flatten(defaultLabelStyle, labelStyle);

  // Handle checkbox toggle
  const handleToggle = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  // Checkmark styles
  const checkmarkStyle = {
    color: '#FFFFFF',
    fontSize: size * 0.7,
    fontWeight: 'bold',
  };

  return (
    <View
      style={mergedContainerStyle}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={value}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...otherProps}
    >
      <View style={mergedCheckboxStyle}>
        {value && (
          <Text style={checkmarkStyle}>✓</Text>
        )}
      </View>
      {label && (
        <Text style={mergedLabelStyle}>{label}</Text>
      )}
    </View>
  );
};

export { Checkbox };
