/**
 * Switch component for Reactive chmlsh
 * A toggle switch component similar to React Native's Switch
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';
import { Animated } from '../Animated';

/**
 * Switch component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Switch = (props) => {
  const {
    value = false,
    disabled = false,
    onValueChange,
    trackColor = { false: '#767577', true: '#81b0ff' },
    thumbColor = value ? '#f5dd4b' : '#f4f3f4',
    ios_backgroundColor,
    style,
    ...otherProps
  } = props;

  // Create animated value for thumb position
  const [thumbPosition] = React.useState(new Animated.Value(value ? 1 : 0));

  // Update thumb position when value changes
  React.useEffect(() => {
    Animated.timing(thumbPosition, {
      toValue: value ? 1 : 0,
      duration: 200,
    }).start();
  }, [value, thumbPosition]);

  // Default styles for Switch
  const defaultStyle = {
    position: 'relative',
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: value ? trackColor.true : trackColor.false,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'default' : 'pointer',
  };

  // iOS background color
  if (ios_backgroundColor) {
    defaultStyle.backgroundColor = ios_backgroundColor;
  }

  // Merge styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);

  // Thumb styles
  const thumbStyle = {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: thumbColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    top: 2,
    left: 2,
    transform: [
      {
        translateX: thumbPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
      },
    ],
  };

  // Handle switch toggle
  const handleToggle = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <View
      style={mergedStyle}
      onClick={handleToggle}
      role="switch"
      aria-checked={value}
      aria-disabled={disabled}
      {...otherProps}
    >
      <Animated.View style={thumbStyle} />
    </View>
  );
};

export { Switch };
