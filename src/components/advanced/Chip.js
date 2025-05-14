/**
 * Chip component for Reactive chmlsh
 * A compact element that represents an input, attribute, or action
 */

import React from 'react';
import { StyleSheet } from '../../StyleSheet';
import { View } from '../View';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';
import { Image } from '../Image';
import { getAccessibilityProps } from '../../accessibility';

/**
 * Chip component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Chip = (props) => {
  const {
    label,
    icon,
    avatar,
    selected = false,
    disabled = false,
    outlined = false,
    onPress,
    onClose,
    closeIcon,
    color,
    textColor,
    selectedColor,
    selectedTextColor,
    style,
    labelStyle,
    iconStyle,
    closeIconStyle,
    ...otherProps
  } = props;

  // Default colors
  const defaultColor = outlined ? 'transparent' : '#E0E0E0';
  const defaultTextColor = '#212121';
  const defaultSelectedColor = '#2196F3';
  const defaultSelectedTextColor = '#FFFFFF';

  // Determine colors based on state
  const backgroundColor = selected
    ? selectedColor || defaultSelectedColor
    : color || defaultColor;
  
  const textColorFinal = selected
    ? selectedTextColor || defaultSelectedTextColor
    : textColor || defaultTextColor;

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 32,
      borderRadius: 16,
      paddingHorizontal: 12,
      backgroundColor,
      ...(outlined && {
        borderWidth: 1,
        borderColor: selected
          ? selectedColor || defaultSelectedColor
          : color || '#BDBDBD',
      }),
      ...(disabled && {
        opacity: 0.5,
      }),
    },
    touchable: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginLeft: -4,
      marginRight: 4,
    },
    icon: {
      width: 18,
      height: 18,
      marginRight: 4,
    },
    label: {
      fontSize: 14,
      color: textColorFinal,
    },
    closeIcon: {
      width: 18,
      height: 18,
      marginLeft: 4,
      marginRight: -4,
    },
  });

  // Merge styles
  const containerStyle = StyleSheet.flatten(defaultStyles.container, style);
  const labelStyleMerged = StyleSheet.flatten(defaultStyles.label, labelStyle);
  const iconStyleMerged = StyleSheet.flatten(defaultStyles.icon, iconStyle);
  const closeIconStyleMerged = StyleSheet.flatten(defaultStyles.closeIcon, closeIconStyle);

  // Default close icon
  const defaultCloseIcon = (
    <Text style={[closeIconStyleMerged, { fontSize: 18 }]}>✕</Text>
  );

  // Accessibility props
  const chipAccessibilityProps = getAccessibilityProps({
    accessible: true,
    accessibilityRole: 'button',
    accessibilityState: {
      selected,
      disabled,
    },
    accessibilityLabel: `${label} ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`,
  });

  // Render chip content
  const renderChipContent = () => (
    <>
      {avatar && (
        <Image
          source={avatar}
          style={defaultStyles.avatar}
          resizeMode="cover"
        />
      )}
      
      {icon && !avatar && (
        typeof icon === 'string' ? (
          <Text style={iconStyleMerged}>{icon}</Text>
        ) : (
          <Image
            source={icon}
            style={iconStyleMerged}
            resizeMode="contain"
          />
        )
      )}
      
      <Text style={labelStyleMerged} numberOfLines={1}>
        {label}
      </Text>
      
      {onClose && (
        <TouchableOpacity
          onPress={disabled ? undefined : onClose}
          style={{ marginLeft: 4 }}
          accessibilityLabel={`Remove ${label}`}
          accessibilityRole="button"
        >
          {closeIcon || defaultCloseIcon}
        </TouchableOpacity>
      )}
    </>
  );

  // If chip is pressable, wrap content in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={disabled ? undefined : onPress}
        {...chipAccessibilityProps}
        {...otherProps}
      >
        {renderChipContent()}
      </TouchableOpacity>
    );
  }

  // Otherwise, render as a View
  return (
    <View
      style={containerStyle}
      {...chipAccessibilityProps}
      {...otherProps}
    >
      {renderChipContent()}
    </View>
  );
};

/**
 * ChipGroup component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const ChipGroup = (props) => {
  const {
    children,
    style,
    spacing = 8,
    singleSelection = false,
    selectedIndex,
    onSelectionChange,
    ...otherProps
  } = props;

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: -spacing / 2,
    },
    chip: {
      margin: spacing / 2,
    },
  });

  // Merge styles
  const containerStyle = StyleSheet.flatten(defaultStyles.container, style);

  // Clone children with additional props
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const isSelected = singleSelection ? index === selectedIndex : child.props.selected;

    return React.cloneElement(child, {
      style: [defaultStyles.chip, child.props.style],
      selected: isSelected,
      onPress: () => {
        if (singleSelection && onSelectionChange) {
          onSelectionChange(index);
        }
        
        if (child.props.onPress) {
          child.props.onPress();
        }
      },
    });
  });

  return (
    <View style={containerStyle} {...otherProps}>
      {enhancedChildren}
    </View>
  );
};

export { Chip, ChipGroup };
