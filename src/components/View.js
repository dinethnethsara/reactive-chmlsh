/**
 * View component for Reactive chmlsh
 * A container component similar to React Native's View
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';

/**
 * View component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const View = (props) => {
  const {
    style,
    children,
    onLayout,
    accessible,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    accessibilityState,
    accessibilityValue,
    importantForAccessibility,
    accessibilityLiveRegion,
    testID,
    ...otherProps
  } = props;

  // Handle layout event
  const handleRef = (element) => {
    if (element && onLayout) {
      const { offsetWidth, offsetHeight } = element;
      onLayout({
        nativeEvent: {
          layout: {
            width: offsetWidth,
            height: offsetHeight,
            x: element.offsetLeft,
            y: element.offsetTop
          }
        }
      });
    }
  };

  // Default styles for View
  const defaultStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  };

  // Merge default styles with provided styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);

  // Prepare accessibility props
  const accessibilityProps = {};

  if (accessible) {
    // Map React Native accessibility props to ARIA attributes
    if (accessibilityRole) {
      accessibilityProps.role = accessibilityRole;
    }

    if (accessibilityLabel) {
      accessibilityProps['aria-label'] = accessibilityLabel;
    }

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

    if (accessibilityValue) {
      if (accessibilityValue.min) {
        accessibilityProps['aria-valuemin'] = accessibilityValue.min;
      }
      if (accessibilityValue.max) {
        accessibilityProps['aria-valuemax'] = accessibilityValue.max;
      }
      if (accessibilityValue.now) {
        accessibilityProps['aria-valuenow'] = accessibilityValue.now;
      }
      if (accessibilityValue.text) {
        accessibilityProps['aria-valuetext'] = accessibilityValue.text;
      }
    }

    if (importantForAccessibility) {
      switch (importantForAccessibility) {
        case 'no-hide-descendants':
          accessibilityProps['aria-hidden'] = true;
          break;
        case 'no':
          accessibilityProps.role = 'presentation';
          break;
        default:
          break;
      }
    }

    if (accessibilityLiveRegion) {
      accessibilityProps['aria-live'] = accessibilityLiveRegion === 'assertive'
        ? 'assertive'
        : 'polite';
    }
  }

  return (
    <div
      ref={handleRef}
      style={mergedStyle}
      data-testid={testID}
      {...accessibilityProps}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export { View };
