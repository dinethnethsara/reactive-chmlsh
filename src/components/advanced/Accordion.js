/**
 * Accordion component for Reactive chmlsh
 * A collapsible content panel
 */

import React, { useState } from 'react';
import { StyleSheet } from '../../StyleSheet';
import { View } from '../View';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';
import { Animated } from '../../Animated';
import { getAccessibilityProps } from '../../accessibility';

/**
 * AccordionItem component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const AccordionItem = (props) => {
  const {
    title,
    children,
    expanded: defaultExpanded = false,
    onToggle,
    titleStyle,
    contentStyle,
    style,
    animationDuration = 300,
    ...otherProps
  } = props;

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [height] = useState(new Animated.Value(defaultExpanded ? 1 : 0));
  const [contentHeight, setContentHeight] = useState(0);

  // Toggle accordion expansion
  const toggleExpand = () => {
    const newExpanded = !expanded;
    
    Animated.timing(height, {
      toValue: newExpanded ? 1 : 0,
      duration: animationDuration,
    }).start();
    
    setExpanded(newExpanded);
    
    if (onToggle) {
      onToggle(newExpanded);
    }
  };

  // Measure content height
  const onLayout = (event) => {
    const { height: layoutHeight } = event.nativeEvent.layout;
    setContentHeight(layoutHeight);
  };

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 4,
      marginBottom: 8,
    },
    title: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#F5F5F5',
    },
    titleText: {
      fontSize: 16,
      fontWeight: '500',
    },
    content: {
      padding: 16,
    },
    arrow: {
      fontSize: 16,
    },
  });

  // Merge styles
  const containerStyle = StyleSheet.flatten(defaultStyles.container, style);
  const headerStyle = StyleSheet.flatten(defaultStyles.title, titleStyle);
  const bodyStyle = StyleSheet.flatten(defaultStyles.content, contentStyle);

  // Accessibility props
  const accordionAccessibilityProps = getAccessibilityProps({
    accessible: true,
    accessibilityRole: 'button',
    accessibilityState: { expanded },
    accessibilityHint: expanded ? 'Collapse this section' : 'Expand this section',
  });

  return (
    <View style={containerStyle} {...otherProps}>
      <TouchableOpacity
        style={headerStyle}
        onPress={toggleExpand}
        {...accordionAccessibilityProps}
      >
        <Text style={defaultStyles.titleText}>{title}</Text>
        <Text style={defaultStyles.arrow}>
          {expanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      <Animated.View
        style={{
          height: height.interpolate({
            inputRange: [0, 1],
            outputRange: [0, contentHeight],
          }),
          overflow: 'hidden',
        }}
      >
        <View style={bodyStyle} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

/**
 * Accordion component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Accordion = (props) => {
  const {
    data,
    renderTitle,
    renderContent,
    multiple = false,
    defaultExpandedIndices = [],
    style,
    ...otherProps
  } = props;

  const [expandedIndices, setExpandedIndices] = useState(
    defaultExpandedIndices.reduce((acc, index) => {
      acc[index] = true;
      return acc;
    }, {})
  );

  // Handle item toggle
  const handleToggle = (index, expanded) => {
    setExpandedIndices((prevState) => {
      if (multiple) {
        return { ...prevState, [index]: expanded };
      } else {
        // If not multiple, collapse all others
        const newState = {};
        if (expanded) {
          newState[index] = true;
        }
        return newState;
      }
    });
  };

  return (
    <View style={style} {...otherProps}>
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          title={renderTitle ? renderTitle(item, index) : item.title}
          expanded={!!expandedIndices[index]}
          onToggle={(expanded) => handleToggle(index, expanded)}
        >
          {renderContent ? renderContent(item, index) : item.content}
        </AccordionItem>
      ))}
    </View>
  );
};

export { Accordion, AccordionItem };
