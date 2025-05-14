/**
 * Picker component for Reactive chmlsh
 * A dropdown picker component similar to React Native's Picker
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';
import { Text } from './Text';

/**
 * Picker.Item component for individual picker items
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const PickerItem = ({ label, value }) => {
  return (
    <option value={value}>{label}</option>
  );
};

/**
 * Picker component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Picker = (props) => {
  const {
    selectedValue,
    onValueChange,
    enabled = true,
    mode = 'dropdown',
    prompt,
    itemStyle,
    style,
    children,
    ...otherProps
  } = props;

  // Default styles for Picker
  const defaultStyle = {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
  };

  // Add disabled styles
  if (!enabled) {
    defaultStyle.backgroundColor = '#F5F5F5';
    defaultStyle.color = '#A9A9A9';
  }

  // Merge styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);

  // Handle value change
  const handleChange = (event) => {
    if (onValueChange) {
      onValueChange(event.target.value, event.target.selectedIndex);
    }
  };

  // Render dialog mode for mobile
  if (mode === 'dialog' && typeof document !== 'undefined' && 'ontouchstart' in document.documentElement) {
    return (
      <View style={mergedStyle}>
        <select
          value={selectedValue}
          onChange={handleChange}
          disabled={!enabled}
          title={prompt}
          style={{
            width: '100%',
            height: '100%',
            opacity: 0,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          {...otherProps}
        >
          {children}
        </select>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 10,
        }}>
          <Text style={itemStyle}>
            {React.Children.toArray(children).find(
              child => child.props.value === selectedValue
            )?.props.label || selectedValue}
          </Text>
          <Text style={{ fontSize: 18 }}>▼</Text>
        </View>
      </View>
    );
  }

  // Render dropdown mode
  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      disabled={!enabled}
      title={prompt}
      style={mergedStyle}
      {...otherProps}
    >
      {children}
    </select>
  );
};

// Attach Item component to Picker
Picker.Item = PickerItem;

export { Picker };
