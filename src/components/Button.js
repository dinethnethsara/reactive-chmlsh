/**
 * Button component for Reactive chmlsh
 * A button component similar to React Native's Button
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';
import { Text } from './Text';
import { View } from './View';

/**
 * Button component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Button = (props) => {
  const { 
    title, 
    onPress, 
    color = '#2196F3', 
    disabled = false, 
    accessibilityLabel,
    style,
    ...otherProps 
  } = props;
  
  // Default styles for Button
  const defaultStyle = {
    backgroundColor: disabled ? '#CCCCCC' : color,
    padding: '8px 16px',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.6 : 1
  };
  
  // Default styles for Button text
  const textStyle = {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center'
  };
  
  // Merge default styles with provided styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);
  
  // Handle button click
  const handleClick = (event) => {
    if (!disabled && onPress) {
      onPress(event);
    }
  };
  
  return (
    <View 
      style={mergedStyle} 
      onClick={handleClick}
      role="button"
      aria-disabled={disabled}
      aria-label={accessibilityLabel || title}
      tabIndex={disabled ? -1 : 0}
      {...otherProps}
    >
      <Text style={textStyle}>
        {title}
      </Text>
    </View>
  );
};

export { Button };
