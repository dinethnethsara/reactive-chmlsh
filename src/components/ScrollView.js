/**
 * ScrollView component for Reactive chmlsh
 * A scrollable container component similar to React Native's ScrollView
 */

import React, { useRef, useEffect } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';

/**
 * ScrollView component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const ScrollView = (props) => {
  const {
    style,
    contentContainerStyle,
    horizontal = false,
    showsHorizontalScrollIndicator = true,
    showsVerticalScrollIndicator = true,
    scrollEnabled = true,
    onScroll,
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    scrollEventThrottle = 16,
    children,
    ...otherProps
  } = props;

  const scrollViewRef = useRef(null);
  let scrollTimeout = null;

  // Default styles for ScrollView
  const defaultStyle = {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  };

  // Add scroll direction styles
  const directionStyle = horizontal
    ? {
        flexDirection: 'row',
        overflowX: 'auto',
        overflowY: 'hidden',
      }
    : {
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
      };

  // Add scroll indicator styles
  const indicatorStyle = {
    scrollbarWidth: 'auto',
    msOverflowStyle: 'auto',
  };

  if (!showsHorizontalScrollIndicator) {
    indicatorStyle.scrollbarWidth = 'none';
    indicatorStyle.msOverflowStyle = 'none';
    indicatorStyle.overflowX = 'hidden';
  }

  if (!showsVerticalScrollIndicator) {
    indicatorStyle.scrollbarWidth = 'none';
    indicatorStyle.msOverflowStyle = 'none';
    indicatorStyle.overflowY = 'hidden';
  }

  // Merge all styles
  const mergedStyle = StyleSheet.flatten(
    defaultStyle,
    directionStyle,
    indicatorStyle,
    scrollEnabled ? {} : { overflow: 'hidden' },
    style
  );

  // Default content container styles
  const defaultContentContainerStyle = {
    flexGrow: 1,
    flexDirection: horizontal ? 'row' : 'column',
  };

  // Merge content container styles
  const mergedContentContainerStyle = StyleSheet.flatten(
    defaultContentContainerStyle,
    contentContainerStyle
  );

  // Handle scroll events
  const handleScroll = (event) => {
    if (onScroll) {
      const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = event.target;
      
      const nativeEvent = {
        contentOffset: {
          x: scrollLeft,
          y: scrollTop,
        },
        contentSize: {
          width: scrollWidth,
          height: scrollHeight,
        },
        layoutMeasurement: {
          width: clientWidth,
          height: clientHeight,
        },
      };
      
      onScroll({ nativeEvent });
    }
  };

  // Set up throttled scroll handler
  useEffect(() => {
    if (scrollViewRef.current && onScroll) {
      const throttledScrollHandler = (event) => {
        if (scrollTimeout === null) {
          scrollTimeout = setTimeout(() => {
            handleScroll(event);
            scrollTimeout = null;
          }, scrollEventThrottle);
        }
      };

      const scrollElement = scrollViewRef.current;
      scrollElement.addEventListener('scroll', throttledScrollHandler);

      return () => {
        scrollElement.removeEventListener('scroll', throttledScrollHandler);
        if (scrollTimeout !== null) {
          clearTimeout(scrollTimeout);
        }
      };
    }
  }, [onScroll, scrollEventThrottle]);

  // Handle drag events
  const handleTouchStart = (event) => {
    if (onScrollBeginDrag) {
      onScrollBeginDrag(event);
    }
  };

  const handleTouchEnd = (event) => {
    if (onScrollEndDrag) {
      onScrollEndDrag(event);
    }
  };

  // Handle momentum scroll events
  const handleMouseDown = (event) => {
    if (onMomentumScrollBegin) {
      onMomentumScrollBegin(event);
    }
  };

  const handleMouseUp = (event) => {
    if (onMomentumScrollEnd) {
      onMomentumScrollEnd(event);
    }
  };

  return (
    <div
      ref={scrollViewRef}
      style={mergedStyle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...otherProps}
    >
      <View style={mergedContentContainerStyle}>
        {children}
      </View>
    </div>
  );
};

export { ScrollView };
