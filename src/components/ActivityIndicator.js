/**
 * ActivityIndicator component for Reactive chmlsh
 * A loading indicator component similar to React Native's ActivityIndicator
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';

/**
 * ActivityIndicator component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const ActivityIndicator = (props) => {
  const {
    animating = true,
    color = '#1976D2',
    size = 'small',
    hidesWhenStopped = true,
    style,
    ...otherProps
  } = props;

  // Determine size based on prop
  let indicatorSize;
  if (size === 'small') {
    indicatorSize = 20;
  } else if (size === 'large') {
    indicatorSize = 36;
  } else if (typeof size === 'number') {
    indicatorSize = size;
  } else {
    indicatorSize = 20;
  }

  // Default styles for ActivityIndicator
  const defaultStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: indicatorSize,
    height: indicatorSize,
  };

  // Hide when not animating if specified
  if (!animating && hidesWhenStopped) {
    defaultStyle.display = 'none';
  }

  // Merge styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);

  // Don't render if not animating and hidesWhenStopped is true
  if (!animating && hidesWhenStopped) {
    return null;
  }

  return (
    <View style={mergedStyle} {...otherProps}>
      <style>
        {`
          @keyframes chmlsh-spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .chmlsh-spinner {
            box-sizing: border-box;
            width: ${indicatorSize}px;
            height: ${indicatorSize}px;
            border-radius: 50%;
            border: ${indicatorSize / 10}px solid ${color};
            border-top-color: transparent;
            animation: chmlsh-spinner-rotate 0.8s linear infinite;
          }
        `}
      </style>
      <div className="chmlsh-spinner" />
    </View>
  );
};

export { ActivityIndicator };
