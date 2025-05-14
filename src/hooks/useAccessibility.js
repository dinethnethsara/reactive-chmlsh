/**
 * useAccessibility hook for Reactive chmlsh
 * A hook to access accessibility features
 */

import { useState, useEffect } from 'react';
import { AccessibilityInfo } from '../accessibility/AccessibilityInfo';

/**
 * Hook to access accessibility features
 * @param {Object} options - Options for the hook
 * @returns {Object} Accessibility state
 */
export function useAccessibility(options = {}) {
  const {
    announceForAccessibility = null,
    checkScreenReader = true,
    checkReduceMotion = true,
    checkInvertColors = false,
  } = options;

  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isInvertColorsEnabled, setIsInvertColorsEnabled] = useState(false);

  // Check screen reader status
  useEffect(() => {
    if (checkScreenReader) {
      let isMounted = true;

      const checkScreenReaderStatus = async () => {
        const enabled = await AccessibilityInfo.isScreenReaderEnabled();
        if (isMounted) {
          setIsScreenReaderEnabled(enabled);
        }
      };

      checkScreenReaderStatus();

      // Set up listener for screen reader changes
      const subscription = AccessibilityInfo.addEventListener(
        'screenReaderChanged',
        (enabled) => {
          if (isMounted) {
            setIsScreenReaderEnabled(enabled);
          }
        }
      );

      return () => {
        isMounted = false;
        subscription.remove();
      };
    }
  }, [checkScreenReader]);

  // Check reduce motion status
  useEffect(() => {
    if (checkReduceMotion) {
      let isMounted = true;

      const checkReduceMotionStatus = async () => {
        const enabled = await AccessibilityInfo.isReduceMotionEnabled();
        if (isMounted) {
          setIsReduceMotionEnabled(enabled);
        }
      };

      checkReduceMotionStatus();

      // Set up listener for reduce motion changes
      const subscription = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        (enabled) => {
          if (isMounted) {
            setIsReduceMotionEnabled(enabled);
          }
        }
      );

      return () => {
        isMounted = false;
        subscription.remove();
      };
    }
  }, [checkReduceMotion]);

  // Check invert colors status
  useEffect(() => {
    if (checkInvertColors) {
      let isMounted = true;

      const checkInvertColorsStatus = async () => {
        const enabled = await AccessibilityInfo.isInvertColorsEnabled();
        if (isMounted) {
          setIsInvertColorsEnabled(enabled);
        }
      };

      checkInvertColorsStatus();

      // Set up listener for invert colors changes
      const subscription = AccessibilityInfo.addEventListener(
        'invertColorsChanged',
        (enabled) => {
          if (isMounted) {
            setIsInvertColorsEnabled(enabled);
          }
        }
      );

      return () => {
        isMounted = false;
        subscription.remove();
      };
    }
  }, [checkInvertColors]);

  // Announce for accessibility if provided
  useEffect(() => {
    if (announceForAccessibility) {
      const { message, priority = 'polite' } = announceForAccessibility;
      if (message) {
        AccessibilityInfo.announceForAccessibility(message, priority);
      }
    }
  }, [announceForAccessibility]);

  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isInvertColorsEnabled,
    announce: (message, priority = 'polite') => {
      AccessibilityInfo.announceForAccessibility(message, priority);
    },
  };
}
