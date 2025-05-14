/**
 * Card component for Reactive chmlsh
 * A container with a shadow and rounded corners
 */

import React from 'react';
import { StyleSheet } from '../../StyleSheet';
import { View } from '../View';
import { Text } from '../Text';
import { Image } from '../Image';
import { TouchableOpacity } from '../TouchableOpacity';
import { getAccessibilityProps } from '../../accessibility';

/**
 * CardHeader component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const CardHeader = (props) => {
  const {
    title,
    subtitle,
    left,
    right,
    style,
    titleStyle,
    subtitleStyle,
    ...otherProps
  } = props;

  // Default styles
  const defaultStyles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    content: {
      flex: 1,
      marginHorizontal: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#212121',
    },
    subtitle: {
      fontSize: 14,
      color: '#757575',
      marginTop: 2,
    },
  });

  // Merge styles
  const headerStyle = StyleSheet.flatten(defaultStyles.header, style);
  const titleStyleMerged = StyleSheet.flatten(defaultStyles.title, titleStyle);
  const subtitleStyleMerged = StyleSheet.flatten(defaultStyles.subtitle, subtitleStyle);

  return (
    <View style={headerStyle} {...otherProps}>
      {left}
      <View style={defaultStyles.content}>
        {title && (
          <Text style={titleStyleMerged} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={subtitleStyleMerged} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
};

/**
 * CardMedia component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const CardMedia = (props) => {
  const {
    source,
    height = 200,
    title,
    subtitle,
    overlay = false,
    style,
    imageStyle,
    titleStyle,
    subtitleStyle,
    ...otherProps
  } = props;

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      height,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'flex-end',
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    subtitle: {
      fontSize: 14,
      color: '#EEEEEE',
      marginTop: 4,
    },
  });

  // Merge styles
  const containerStyle = StyleSheet.flatten(defaultStyles.container, style);
  const imageStyleMerged = StyleSheet.flatten(defaultStyles.image, imageStyle);
  const titleStyleMerged = StyleSheet.flatten(defaultStyles.title, titleStyle);
  const subtitleStyleMerged = StyleSheet.flatten(defaultStyles.subtitle, subtitleStyle);

  return (
    <View style={containerStyle} {...otherProps}>
      <Image source={source} style={imageStyleMerged} resizeMode="cover" />
      
      {(title || subtitle) && overlay && (
        <View style={defaultStyles.overlay}>
          {title && <Text style={titleStyleMerged}>{title}</Text>}
          {subtitle && <Text style={subtitleStyleMerged}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

/**
 * CardContent component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const CardContent = (props) => {
  const { style, children, ...otherProps } = props;

  // Default styles
  const defaultStyles = StyleSheet.create({
    content: {
      padding: 16,
    },
  });

  // Merge styles
  const contentStyle = StyleSheet.flatten(defaultStyles.content, style);

  return (
    <View style={contentStyle} {...otherProps}>
      {children}
    </View>
  );
};

/**
 * CardActions component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const CardActions = (props) => {
  const { style, children, ...otherProps } = props;

  // Default styles
  const defaultStyles = StyleSheet.create({
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
    },
  });

  // Merge styles
  const actionsStyle = StyleSheet.flatten(defaultStyles.actions, style);

  return (
    <View style={actionsStyle} {...otherProps}>
      {children}
    </View>
  );
};

/**
 * Card component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Card = (props) => {
  const {
    style,
    children,
    onPress,
    elevation = 2,
    outlined = false,
    ...otherProps
  } = props;

  // Default styles
  const defaultStyles = StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 4,
      overflow: 'hidden',
      marginVertical: 8,
      ...(outlined
        ? {
            borderWidth: 1,
            borderColor: '#E0E0E0',
          }
        : {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: elevation },
            shadowOpacity: 0.1 + elevation * 0.03,
            shadowRadius: 1 + elevation,
            elevation: elevation,
          }),
    },
  });

  // Merge styles
  const cardStyle = StyleSheet.flatten(defaultStyles.card, style);

  // Accessibility props
  const cardAccessibilityProps = getAccessibilityProps({
    accessible: true,
    accessibilityRole: onPress ? 'button' : 'none',
  });

  // Wrap with TouchableOpacity if onPress is provided
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={cardStyle}
      onPress={onPress}
      {...cardAccessibilityProps}
      {...otherProps}
    >
      {children}
    </CardContainer>
  );
};

// Attach sub-components
Card.Header = CardHeader;
Card.Media = CardMedia;
Card.Content = CardContent;
Card.Actions = CardActions;

export { Card };
