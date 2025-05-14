/**
 * Image component for Reactive chmlsh
 * An image component similar to React Native's Image
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet } from '../StyleSheet';

/**
 * Image component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Image = (props) => {
  const { 
    style, 
    source, 
    resizeMode = 'cover', 
    onLoad, 
    onError, 
    defaultSource,
    ...otherProps 
  } = props;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Default styles for Image
  const defaultStyle = {
    maxWidth: '100%',
    overflow: 'hidden'
  };
  
  // Handle resize mode
  let objectFit = 'cover';
  switch (resizeMode) {
    case 'contain':
      objectFit = 'contain';
      break;
    case 'stretch':
      objectFit = 'fill';
      break;
    case 'center':
      objectFit = 'none';
      break;
    case 'repeat':
      objectFit = 'cover';
      backgroundRepeat = 'repeat';
      break;
    default:
      objectFit = 'cover';
  }
  
  // Merge default styles with provided styles
  const mergedStyle = StyleSheet.flatten(
    defaultStyle,
    { objectFit },
    style
  );
  
  // Handle image loading
  const handleLoad = (event) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  };
  
  // Handle image error
  const handleError = (event) => {
    setHasError(true);
    if (onError) {
      onError(event);
    }
  };
  
  // Determine the source URL
  const src = hasError && defaultSource ? defaultSource : 
              (typeof source === 'string' ? source : source?.uri);
  
  return (
    <img
      src={src}
      style={mergedStyle}
      onLoad={handleLoad}
      onError={handleError}
      alt={props.alt || ''}
      {...otherProps}
    />
  );
};

export { Image };
