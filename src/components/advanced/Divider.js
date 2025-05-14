/**
 * Divider component for Reactive chmlsh
 * A thin line that groups content in lists and layouts
 */

import React from 'react';
import { StyleSheet } from '../../StyleSheet';
import { View } from '../View';
import { Text } from '../Text';

/**
 * Divider component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Divider = (props) => {
  const {
    style,
    orientation = 'horizontal',
    inset = false,
    light = false,
    thickness = 1,
    color = '#E0E0E0',
    text,
    textStyle,
    textAlign = 'center',
    ...otherProps
  } = props;

  // Calculate inset value
  const insetValue = typeof inset === 'boolean' ? (inset ? 16 : 0) : inset;

  // Default styles
  const defaultStyles = StyleSheet.create({
    horizontal: {
      height: thickness,
      backgroundColor: light ? `${color}80` : color,
      marginLeft: insetValue,
      marginRight: insetValue,
      alignSelf: 'stretch',
    },
    vertical: {
      width: thickness,
      backgroundColor: light ? `${color}80` : color,
      marginTop: insetValue,
      marginBottom: insetValue,
      alignSelf: 'stretch',
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    line: {
      flex: 1,
      height: thickness,
      backgroundColor: light ? `${color}80` : color,
    },
    text: {
      paddingHorizontal: 16,
      color: '#757575',
      fontSize: 14,
    },
  });

  // Merge styles
  const dividerStyle = StyleSheet.flatten(
    orientation === 'horizontal' ? defaultStyles.horizontal : defaultStyles.vertical,
    style
  );
  const textStyleMerged = StyleSheet.flatten(defaultStyles.text, textStyle);

  // If text is provided, render a text divider
  if (text && orientation === 'horizontal') {
    // Determine flex values based on text alignment
    let leftFlex = 1;
    let rightFlex = 1;
    
    switch (textAlign) {
      case 'left':
        leftFlex = 0.5;
        rightFlex = 2;
        break;
      case 'right':
        leftFlex = 2;
        rightFlex = 0.5;
        break;
      case 'center':
      default:
        leftFlex = 1;
        rightFlex = 1;
        break;
    }

    return (
      <View style={defaultStyles.textContainer} {...otherProps}>
        <View style={[defaultStyles.line, { flex: leftFlex, marginLeft: insetValue }]} />
        <Text style={textStyleMerged}>{text}</Text>
        <View style={[defaultStyles.line, { flex: rightFlex, marginRight: insetValue }]} />
      </View>
    );
  }

  // Otherwise, render a simple divider
  return <View style={dividerStyle} {...otherProps} />;
};

export { Divider };
