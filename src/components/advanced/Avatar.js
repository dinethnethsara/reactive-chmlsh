/**
 * Avatar component for Reactive chmlsh
 * A component to display user avatars
 */

import React, { useState } from 'react';
import { StyleSheet } from '../../StyleSheet';
import { View } from '../View';
import { Text } from '../Text';
import { Image } from '../Image';
import { getAccessibilityProps } from '../../accessibility';

/**
 * Get initials from a name
 * @param {string} name - Name to get initials from
 * @returns {string} Initials
 * @private
 */
const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Get a color based on a string
 * @param {string} str - String to generate color from
 * @returns {string} Color hex code
 * @private
 */
const getColorFromString = (str) => {
  if (!str) return '#757575';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

/**
 * Avatar component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Avatar = (props) => {
  const {
    source,
    name,
    size = 40,
    rounded = true,
    backgroundColor,
    textColor = '#FFFFFF',
    style,
    imageStyle,
    textStyle,
    onPress,
    onError,
    ...otherProps
  } = props;

  const [hasError, setHasError] = useState(false);

  // Handle image error
  const handleError = (error) => {
    setHasError(true);
    if (onError) {
      onError(error);
    }
  };

  // Calculate styles
  const containerSize = {
    width: size,
    height: size,
  };

  const borderRadius = rounded ? size / 2 : size / 8;

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      ...containerSize,
      borderRadius,
      backgroundColor: backgroundColor || (name ? getColorFromString(name) : '#757575'),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      ...containerSize,
    },
    text: {
      color: textColor,
      fontSize: size / 2.5,
      fontWeight: '600',
    },
  });

  // Merge styles
  const containerStyle = StyleSheet.flatten(defaultStyles.container, style);
  const imageStyleMerged = StyleSheet.flatten(defaultStyles.image, imageStyle);
  const textStyleMerged = StyleSheet.flatten(defaultStyles.text, textStyle);

  // Accessibility props
  const avatarAccessibilityProps = getAccessibilityProps({
    accessible: true,
    accessibilityRole: 'image',
    accessibilityLabel: name ? `Avatar for ${name}` : 'Avatar',
  });

  // Render avatar
  const renderContent = () => {
    // Show image if provided and no error
    if (source && !hasError) {
      return (
        <Image
          source={source}
          style={imageStyleMerged}
          onError={handleError}
        />
      );
    }
    
    // Show initials if name is provided
    if (name) {
      return <Text style={textStyleMerged}>{getInitials(name)}</Text>;
    }
    
    // Default empty avatar
    return null;
  };

  return (
    <View
      style={containerStyle}
      {...avatarAccessibilityProps}
      {...otherProps}
    >
      {renderContent()}
    </View>
  );
};

/**
 * AvatarGroup component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const AvatarGroup = (props) => {
  const {
    avatars,
    max = 3,
    size = 40,
    spacing = -8,
    style,
    ...otherProps
  } = props;

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginRight: spacing,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    more: {
      backgroundColor: '#E0E0E0',
    },
  });

  // Merge styles
  const containerStyle = StyleSheet.flatten(defaultStyles.container, style);

  // Determine how many avatars to show
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <View style={containerStyle} {...otherProps}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          size={size}
          style={defaultStyles.avatar}
          {...avatar}
        />
      ))}
      
      {remainingCount > 0 && (
        <Avatar
          size={size}
          style={[defaultStyles.avatar, defaultStyles.more]}
          name={`+${remainingCount}`}
        />
      )}
    </View>
  );
};

export { Avatar, AvatarGroup };
