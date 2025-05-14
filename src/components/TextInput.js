/**
 * TextInput component for Reactive chmlsh
 * A text input component similar to React Native's TextInput
 */

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';

/**
 * TextInput component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const TextInput = (props) => {
  const {
    style,
    value,
    defaultValue,
    placeholder,
    placeholderTextColor = '#A9A9A9',
    multiline = false,
    numberOfLines = 1,
    editable = true,
    autoFocus = false,
    secureTextEntry = false,
    keyboardType = 'default',
    maxLength,
    onChangeText,
    onChange,
    onFocus,
    onBlur,
    onSubmitEditing,
    onKeyPress,
    blurOnSubmit = !multiline,
    selectTextOnFocus = false,
    selectionColor,
    ...otherProps
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Default styles for TextInput
  const defaultStyle = {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    outlineStyle: 'none',
    minHeight: multiline ? numberOfLines * 20 : 40,
    width: '100%',
    boxSizing: 'border-box',
  };

  // Add focus styles
  if (isFocused) {
    defaultStyle.borderColor = '#2196F3';
  }

  // Add disabled styles
  if (!editable) {
    defaultStyle.backgroundColor = '#F5F5F5';
    defaultStyle.color = '#A9A9A9';
  }

  // Merge styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);

  // Handle text change
  const handleChange = (event) => {
    const text = event.target.value;
    
    if (onChange) {
      onChange(event);
    }
    
    if (onChangeText) {
      onChangeText(text);
    }
  };

  // Handle focus
  const handleFocus = (event) => {
    setIsFocused(true);
    
    if (selectTextOnFocus) {
      event.target.select();
    }
    
    if (onFocus) {
      onFocus(event);
    }
  };

  // Handle blur
  const handleBlur = (event) => {
    setIsFocused(false);
    
    if (onBlur) {
      onBlur(event);
    }
  };

  // Handle key press
  const handleKeyPress = (event) => {
    if (onKeyPress) {
      const nativeEvent = {
        key: event.key,
      };
      
      onKeyPress({ nativeEvent });
    }
    
    // Handle submit on Enter key press
    if (event.key === 'Enter' && blurOnSubmit) {
      if (onSubmitEditing) {
        onSubmitEditing({ nativeEvent: { text: event.target.value } });
      }
      
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Map React Native keyboard types to HTML input types
  const getInputType = () => {
    switch (keyboardType) {
      case 'numeric':
        return 'number';
      case 'email-address':
        return 'email';
      case 'phone-pad':
        return 'tel';
      case 'url':
        return 'url';
      default:
        return secureTextEntry ? 'password' : 'text';
    }
  };

  // Create placeholder styles
  const placeholderStyle = {
    color: placeholderTextColor,
  };

  // Determine which element to render based on multiline
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <InputComponent
      ref={inputRef}
      style={mergedStyle}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={!editable}
      maxLength={maxLength}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
      type={getInputType()}
      rows={multiline ? numberOfLines : undefined}
      autoFocus={autoFocus}
      data-selection-color={selectionColor}
      {...otherProps}
    />
  );
};

export { TextInput };
