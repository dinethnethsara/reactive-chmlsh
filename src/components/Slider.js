/**
 * Slider component for Reactive chmlsh
 * A slider component similar to React Native's Slider
 */

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';
import { Animated } from '../Animated';

/**
 * Slider component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Slider = (props) => {
  const {
    value = 0,
    minimumValue = 0,
    maximumValue = 1,
    step = 0,
    minimumTrackTintColor = '#3f3f3f',
    maximumTrackTintColor = '#b3b3b3',
    thumbTintColor = '#343434',
    thumbStyle,
    trackStyle,
    disabled = false,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    style,
    ...otherProps
  } = props;

  const [currentValue, setCurrentValue] = useState(value);
  const [sliding, setSliding] = useState(false);
  const sliderRef = useRef(null);

  // Update current value when prop value changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Default styles for Slider
  const defaultStyle = {
    height: 40,
    width: '100%',
    position: 'relative',
  };

  // Merge styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);

  // Calculate percentage for positioning
  const percentage = ((currentValue - minimumValue) / (maximumValue - minimumValue)) * 100;

  // Default track styles
  const defaultTrackStyle = {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    top: '50%',
    transform: 'translateY(-50%)',
  };

  // Minimum track style (filled part)
  const minimumTrackStyle = {
    ...defaultTrackStyle,
    left: 0,
    width: `${percentage}%`,
    backgroundColor: minimumTrackTintColor,
  };

  // Maximum track style (unfilled part)
  const maximumTrackStyle = {
    ...defaultTrackStyle,
    right: 0,
    width: `${100 - percentage}%`,
    backgroundColor: maximumTrackTintColor,
  };

  // Default thumb style
  const defaultThumbStyle = {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: thumbTintColor,
    top: '50%',
    transform: 'translate(-50%, -50%)',
    left: `${percentage}%`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    cursor: disabled ? 'default' : 'pointer',
  };

  // Merge thumb styles
  const mergedThumbStyle = StyleSheet.flatten(defaultThumbStyle, thumbStyle);

  // Merge track styles
  const mergedMinTrackStyle = StyleSheet.flatten(minimumTrackStyle, trackStyle);
  const mergedMaxTrackStyle = StyleSheet.flatten(maximumTrackStyle, trackStyle);

  // Handle slider change
  const handleChange = (event) => {
    if (disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const width = rect.width;
    const offsetX = event.clientX - rect.left;
    
    // Calculate new value
    let newValue = ((offsetX / width) * (maximumValue - minimumValue)) + minimumValue;
    
    // Apply step if provided
    if (step > 0) {
      newValue = Math.round(newValue / step) * step;
    }
    
    // Clamp value to range
    newValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
    
    setCurrentValue(newValue);
    
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Handle mouse down
  const handleMouseDown = (event) => {
    if (disabled) return;
    
    setSliding(true);
    handleChange(event);
    
    if (onSlidingStart) {
      onSlidingStart(currentValue);
    }
    
    // Add document-level event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle mouse move
  const handleMouseMove = (event) => {
    if (sliding) {
      handleChange(event);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (sliding) {
      setSliding(false);
      
      if (onSlidingComplete) {
        onSlidingComplete(currentValue);
      }
      
      // Remove document-level event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sliding]);

  return (
    <View
      ref={sliderRef}
      style={mergedStyle}
      onMouseDown={handleMouseDown}
      role="slider"
      aria-valuemin={minimumValue}
      aria-valuemax={maximumValue}
      aria-valuenow={currentValue}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...otherProps}
    >
      <View style={mergedMinTrackStyle} />
      <View style={mergedMaxTrackStyle} />
      <View style={mergedThumbStyle} />
    </View>
  );
};

export { Slider };
