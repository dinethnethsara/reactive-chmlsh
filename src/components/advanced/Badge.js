/**
 * Badge component for Reactive chmlsh
 * A small status descriptor for UI elements
 */

import React from 'react';
import { StyleSheet } from '../../StyleSheet';
import { View } from '../View';
import { Text } from '../Text';
import { getAccessibilityProps } from '../../accessibility';

/**
 * Badge component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Badge = (props) => {
  const {
    value,
    visible = true,
    color = '#F44336',
    textColor = '#FFFFFF',
    size = 'medium',
    position = 'top-right',
    standalone = false,
    max,
    showZero = false,
    style,
    textStyle,
    children,
    ...otherProps
  } = props;

  // Don't render if not visible or value is 0 and showZero is false
  if (!visible || (value === 0 && !showZero && !standalone)) {
    return children || null;
  }

  // Determine badge size
  let badgeSize;
  let fontSize;
  let minWidth;
  
  switch (size) {
    case 'small':
      badgeSize = 16;
      fontSize = 10;
      minWidth = 16;
      break;
    case 'large':
      badgeSize = 24;
      fontSize = 14;
      minWidth = 24;
      break;
    case 'medium':
    default:
      badgeSize = 20;
      fontSize = 12;
      minWidth = 20;
      break;
  }

  // Format badge value
  let displayValue = value;
  
  if (max !== undefined && value > max) {
    displayValue = `${max}+`;
  }

  // Determine badge position
  let positionStyle = {};
  
  if (!standalone) {
    switch (position) {
      case 'top-left':
        positionStyle = {
          position: 'absolute',
          top: -badgeSize / 2,
          left: -badgeSize / 2,
        };
        break;
      case 'bottom-right':
        positionStyle = {
          position: 'absolute',
          bottom: -badgeSize / 2,
          right: -badgeSize / 2,
        };
        break;
      case 'bottom-left':
        positionStyle = {
          position: 'absolute',
          bottom: -badgeSize / 2,
          left: -badgeSize / 2,
        };
        break;
      case 'top-right':
      default:
        positionStyle = {
          position: 'absolute',
          top: -badgeSize / 2,
          right: -badgeSize / 2,
        };
        break;
    }
  }

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    badge: {
      height: badgeSize,
      minWidth: minWidth,
      borderRadius: badgeSize / 2,
      backgroundColor: color,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      ...positionStyle,
    },
    text: {
      color: textColor,
      fontSize: fontSize,
      fontWeight: '600',
      textAlign: 'center',
    },
    dot: {
      width: badgeSize / 2,
      height: badgeSize / 2,
      borderRadius: badgeSize / 4,
      backgroundColor: color,
      ...positionStyle,
    },
  });

  // Merge styles
  const badgeStyle = StyleSheet.flatten(
    displayValue === undefined ? defaultStyles.dot : defaultStyles.badge,
    style
  );
  const badgeTextStyle = StyleSheet.flatten(defaultStyles.text, textStyle);

  // Accessibility props
  const badgeAccessibilityProps = getAccessibilityProps({
    accessible: true,
    accessibilityRole: 'text',
    accessibilityLabel: displayValue !== undefined 
      ? `Badge with value ${displayValue}` 
      : 'Badge indicator',
  });

  // Render badge
  const renderBadge = () => (
    <View style={badgeStyle} {...badgeAccessibilityProps} {...otherProps}>
      {displayValue !== undefined && (
        <Text style={badgeTextStyle} numberOfLines={1}>
          {displayValue}
        </Text>
      )}
    </View>
  );

  // If standalone, just render the badge
  if (standalone) {
    return renderBadge();
  }

  // Otherwise, render badge with children
  return (
    <View style={defaultStyles.container}>
      {children}
      {renderBadge()}
    </View>
  );
};

export { Badge };
