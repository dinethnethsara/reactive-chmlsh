/**
 * Drawer component for Reactive chmlsh
 * A panel that slides in from the edge of the screen
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet } from '../../StyleSheet';
import { View } from '../View';
import { TouchableOpacity } from '../TouchableOpacity';
import { Animated } from '../../Animated';
import { Dimensions } from '../../Dimensions';
import { getAccessibilityProps } from '../../accessibility';

/**
 * Drawer component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Drawer = (props) => {
  const {
    open = false,
    position = 'left',
    width = 300,
    height,
    onClose,
    drawerContent,
    drawerStyle,
    overlayStyle,
    overlayColor = 'rgba(0, 0, 0, 0.5)',
    animationDuration = 300,
    swipeEnabled = true,
    swipeThreshold = 100,
    swipeMinVelocity = 0.3,
    swipeMaxVelocity = 0.5,
    children,
    ...otherProps
  } = props;

  // Get screen dimensions
  const screenDimensions = Dimensions.get().window;
  const screenWidth = screenDimensions.width;
  const screenHeight = screenDimensions.height;

  // Determine drawer dimensions
  const drawerWidth = position === 'left' || position === 'right' ? width : screenWidth;
  const drawerHeight = position === 'top' || position === 'bottom' ? (height || 300) : screenHeight;

  // Animation values
  const [animation] = useState(new Animated.Value(0));
  const [overlayAnimation] = useState(new Animated.Value(0));
  const [dragging, setDragging] = useState(false);
  const [dragStartValue, setDragStartValue] = useState(0);
  const [lastDragValue, setLastDragValue] = useState(0);

  // Update animation when open state changes
  useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();

    Animated.timing(overlayAnimation, {
      toValue: open ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [open, animationDuration, animation, overlayAnimation]);

  // Calculate drawer position based on position prop
  const getDrawerPosition = () => {
    switch (position) {
      case 'right':
        return {
          right: 0,
          top: 0,
          bottom: 0,
          width: drawerWidth,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [drawerWidth, 0],
              }),
            },
          ],
        };
      case 'top':
        return {
          left: 0,
          right: 0,
          top: 0,
          height: drawerHeight,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-drawerHeight, 0],
              }),
            },
          ],
        };
      case 'bottom':
        return {
          left: 0,
          right: 0,
          bottom: 0,
          height: drawerHeight,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [drawerHeight, 0],
              }),
            },
          ],
        };
      case 'left':
      default:
        return {
          left: 0,
          top: 0,
          bottom: 0,
          width: drawerWidth,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-drawerWidth, 0],
              }),
            },
          ],
        };
    }
  };

  // Handle touch start
  const handleTouchStart = (event) => {
    if (!swipeEnabled || !open) return;

    const touch = event.nativeEvent.touches[0];
    const touchX = touch.pageX;
    const touchY = touch.pageY;

    // Check if touch is near the edge of the drawer
    const isNearEdge = (
      (position === 'left' && touchX < 20) ||
      (position === 'right' && touchX > screenWidth - 20) ||
      (position === 'top' && touchY < 20) ||
      (position === 'bottom' && touchY > screenHeight - 20)
    );

    if (isNearEdge) {
      setDragging(true);
      setDragStartValue(position === 'left' || position === 'right' ? touchX : touchY);
      setLastDragValue(position === 'left' || position === 'right' ? touchX : touchY);
    }
  };

  // Handle touch move
  const handleTouchMove = (event) => {
    if (!dragging) return;

    const touch = event.nativeEvent.touches[0];
    const currentValue = position === 'left' || position === 'right' ? touch.pageX : touch.pageY;
    setLastDragValue(currentValue);

    // Calculate drag distance
    let dragDistance = 0;
    
    switch (position) {
      case 'left':
        dragDistance = currentValue - dragStartValue;
        break;
      case 'right':
        dragDistance = dragStartValue - currentValue;
        break;
      case 'top':
        dragDistance = currentValue - dragStartValue;
        break;
      case 'bottom':
        dragDistance = dragStartValue - currentValue;
        break;
    }

    // Calculate new animation value
    const newAnimationValue = Math.max(0, Math.min(1, 1 - dragDistance / (position === 'left' || position === 'right' ? drawerWidth : drawerHeight)));
    
    // Update animation
    animation.setValue(newAnimationValue);
    overlayAnimation.setValue(newAnimationValue);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!dragging) return;

    setDragging(false);

    // Calculate velocity
    const dragDistance = lastDragValue - dragStartValue;
    const dragPercentage = Math.abs(dragDistance) / (position === 'left' || position === 'right' ? drawerWidth : drawerHeight);
    
    // Determine if drawer should close
    const shouldClose = (
      (position === 'left' && dragDistance < 0 && (dragPercentage > swipeThreshold || dragPercentage > swipeMinVelocity)) ||
      (position === 'right' && dragDistance > 0 && (dragPercentage > swipeThreshold || dragPercentage > swipeMinVelocity)) ||
      (position === 'top' && dragDistance < 0 && (dragPercentage > swipeThreshold || dragPercentage > swipeMinVelocity)) ||
      (position === 'bottom' && dragDistance > 0 && (dragPercentage > swipeThreshold || dragPercentage > swipeMinVelocity))
    );

    if (shouldClose && onClose) {
      onClose();
    } else {
      // Reset animation
      Animated.timing(animation, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();

      Animated.timing(overlayAnimation, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  };

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: overlayColor,
      opacity: overlayAnimation,
    },
    drawer: {
      position: 'absolute',
      backgroundColor: '#FFFFFF',
      ...getDrawerPosition(),
    },
  });

  // Merge styles
  const drawerStyleMerged = StyleSheet.flatten(defaultStyles.drawer, drawerStyle);
  const overlayStyleMerged = StyleSheet.flatten(defaultStyles.overlay, overlayStyle);

  // Accessibility props
  const drawerAccessibilityProps = getAccessibilityProps({
    accessible: true,
    accessibilityRole: 'dialog',
    accessibilityState: { expanded: open },
    accessibilityLabel: 'Navigation drawer',
  });

  return (
    <View
      style={defaultStyles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...otherProps}
    >
      {children}
      
      {open && (
        <TouchableOpacity
          style={overlayStyleMerged}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Close drawer"
          accessibilityRole="button"
        />
      )}
      
      <Animated.View
        style={drawerStyleMerged}
        {...drawerAccessibilityProps}
      >
        {drawerContent}
      </Animated.View>
    </View>
  );
};

export { Drawer };
