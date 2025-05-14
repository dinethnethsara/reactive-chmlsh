/**
 * TouchableOpacity component for Reactive chmlsh
 * A wrapper component that provides opacity feedback on touch
 */

import React, { useState } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';
import { Animated } from '../Animated';

/**
 * TouchableOpacity component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const TouchableOpacity = (props) => {
  const {
    style,
    activeOpacity = 0.2,
    disabled = false,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    delayLongPress = 500,
    children,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    accessibilityState,
    testID,
    ...otherProps
  } = props;

  // Create animated value for opacity
  const [opacityAnim] = useState(new Animated.Value(1));
  
  // Track press state
  const [isPressed, setIsPressed] = useState(false);
  let longPressTimeout = null;

  // Default styles for TouchableOpacity
  const defaultStyle = {
    cursor: disabled ? 'default' : 'pointer',
  };

  // Merge styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);

  // Handle press in
  const handlePressIn = (event) => {
    if (disabled) return;

    setIsPressed(true);
    
    // Animate opacity
    Animated.timing(opacityAnim, {
      toValue: activeOpacity,
      duration: 150,
      useNativeDriver: true,
    }).start();
    
    // Set up long press timeout
    if (onLongPress) {
      longPressTimeout = setTimeout(() => {
        if (isPressed) {
          onLongPress(event);
        }
      }, delayLongPress);
    }
    
    if (onPressIn) {
      onPressIn(event);
    }
  };

  // Handle press out
  const handlePressOut = (event) => {
    if (disabled) return;

    setIsPressed(false);
    
    // Animate opacity back
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
    
    // Clear long press timeout
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      longPressTimeout = null;
    }
    
    if (onPressOut) {
      onPressOut(event);
    }
  };

  // Handle click/tap
  const handlePress = (event) => {
    if (disabled) return;
    
    if (onPress && isPressed) {
      onPress(event);
    }
  };

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (longPressTimeout) {
        clearTimeout(longPressTimeout);
      }
    };
  }, []);

  // Accessibility props
  const accessibilityProps = {
    role: accessibilityRole,
    'aria-label': accessibilityLabel,
    'aria-disabled': disabled,
    'aria-pressed': isPressed,
  };

  if (accessibilityHint) {
    accessibilityProps['aria-describedby'] = accessibilityHint;
  }

  if (accessibilityState) {
    if (accessibilityState.disabled) {
      accessibilityProps['aria-disabled'] = accessibilityState.disabled;
    }
    if (accessibilityState.selected) {
      accessibilityProps['aria-selected'] = accessibilityState.selected;
    }
    if (accessibilityState.checked) {
      accessibilityProps['aria-checked'] = accessibilityState.checked;
    }
    if (accessibilityState.busy) {
      accessibilityProps['aria-busy'] = accessibilityState.busy;
    }
    if (accessibilityState.expanded) {
      accessibilityProps['aria-expanded'] = accessibilityState.expanded;
    }
  }

  return (
    <Animated.View
      style={[mergedStyle, { opacity: opacityAnim }]}
      onMouseDown={handlePressIn}
      onMouseUp={handlePressOut}
      onMouseLeave={handlePressOut}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
      onClick={handlePress}
      tabIndex={disabled ? -1 : 0}
      data-testid={testID}
      {...accessibilityProps}
      {...otherProps}
    >
      {children}
    </Animated.View>
  );
};

export { TouchableOpacity };
