/**
 * Modal component for Reactive chmlsh
 * A modal component similar to React Native's Modal
 */

import React, { useEffect } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';
import { Platform } from '../Platform';

/**
 * Modal component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Modal = (props) => {
  const {
    visible = false,
    transparent = false,
    animationType = 'none',
    onRequestClose,
    onShow,
    hardwareAccelerated = false,
    statusBarTranslucent = false,
    children,
    ...otherProps
  } = props;

  // Handle escape key press for closing modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (visible && event.key === 'Escape' && onRequestClose) {
        onRequestClose();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [visible, onRequestClose]);

  // Call onShow when modal becomes visible
  useEffect(() => {
    if (visible && onShow) {
      onShow();
    }
  }, [visible, onShow]);

  // Don't render anything if not visible
  if (!visible) {
    return null;
  }

  // Default styles for Modal
  const defaultStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Background styles based on transparency
  const backgroundStyle = transparent
    ? { backgroundColor: 'transparent' }
    : { backgroundColor: 'rgba(0, 0, 0, 0.5)' };

  // Animation styles
  let animationStyle = {};
  if (animationType === 'fade') {
    animationStyle = {
      animation: 'chmlsh-modal-fade 0.3s ease-in-out',
    };
  } else if (animationType === 'slide') {
    animationStyle = {
      animation: 'chmlsh-modal-slide 0.3s ease-in-out',
    };
  }

  // Hardware acceleration style
  const accelerationStyle = hardwareAccelerated
    ? { transform: 'translateZ(0)' }
    : {};

  // Status bar style for mobile
  const statusBarStyle = Platform.isIOS() && statusBarTranslucent
    ? { paddingTop: 20 }
    : {};

  // Merge all styles
  const mergedStyle = StyleSheet.flatten(
    defaultStyle,
    backgroundStyle,
    animationStyle,
    accelerationStyle,
    statusBarStyle
  );

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && onRequestClose) {
      onRequestClose();
    }
  };

  return (
    <div
      style={mergedStyle}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      {...otherProps}
    >
      <style>
        {`
          @keyframes chmlsh-modal-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes chmlsh-modal-slide {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}
      </style>
      <View style={{ maxWidth: '100%', maxHeight: '100%' }}>
        {children}
      </View>
    </div>
  );
};

export { Modal };
