/**
 * Text component for Reactive chmlsh
 * A text component similar to React Native's Text
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';

/**
 * Text component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Text = (props) => {
  const { style, children, numberOfLines, ellipsizeMode, onPress, ...otherProps } = props;
  
  // Default styles for Text
  const defaultStyle = {
    fontFamily: 'System',
    fontSize: 14,
    color: '#000000',
    margin: 0,
    padding: 0
  };
  
  // Handle numberOfLines and ellipsizeMode
  let textOverflow = 'clip';
  let overflow = 'visible';
  let whiteSpace = 'normal';
  let display;
  let WebkitLineClamp;
  let WebkitBoxOrient;
  let direction;
  
  if (numberOfLines) {
    overflow = 'hidden';
    whiteSpace = 'nowrap';
    
    if (numberOfLines > 1) {
      whiteSpace = 'normal';
      display = '-webkit-box';
      WebkitLineClamp = numberOfLines;
      WebkitBoxOrient = 'vertical';
    }
    
    if (ellipsizeMode === 'head') {
      textOverflow = 'ellipsis';
      direction = 'rtl';
    } else if (ellipsizeMode === 'middle') {
      textOverflow = 'ellipsis';
      // Middle ellipsis is not well supported in CSS, this is an approximation
    } else if (ellipsizeMode === 'tail' || !ellipsizeMode) {
      textOverflow = 'ellipsis';
    }
  }
  
  // Merge default styles with provided styles
  const mergedStyle = StyleSheet.flatten(
    defaultStyle,
    { textOverflow, overflow, whiteSpace, display, WebkitLineClamp, WebkitBoxOrient, direction },
    style
  );
  
  // Handle onPress event
  const handleClick = onPress ? (event) => onPress(event) : undefined;
  
  return (
    <span 
      style={mergedStyle} 
      onClick={handleClick}
      {...otherProps}
    >
      {children}
    </span>
  );
};

export { Text };
