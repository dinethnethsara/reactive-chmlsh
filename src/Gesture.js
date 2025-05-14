/**
 * Gesture utility for Reactive chmlsh
 * A gesture handling system for touch and mouse events
 */

import React, { useRef, useEffect } from 'react';

/**
 * Gesture class for handling touch and mouse gestures
 */
class Gesture {
  /**
   * Create a tap gesture handler
   * @param {Function} onTap - Function to call when tap is detected
   * @param {Object} options - Gesture options
   * @returns {Object} Gesture handler
   */
  static createTapGesture(onTap, options = {}) {
    const {
      numberOfTaps = 1,
      maxDuration = 300,
      maxDistance = 10,
    } = options;
    
    let tapCount = 0;
    let startTime = 0;
    let startX = 0;
    let startY = 0;
    let timeout = null;
    
    const resetState = () => {
      tapCount = 0;
      startTime = 0;
      startX = 0;
      startY = 0;
      
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    
    return {
      onTouchStart: (event) => {
        const touch = event.touches[0];
        
        if (tapCount === 0) {
          startTime = Date.now();
          startX = touch.clientX;
          startY = touch.clientY;
          tapCount = 1;
        } else {
          // Check if this is a subsequent tap
          const timeDiff = Date.now() - startTime;
          
          if (timeDiff <= maxDuration * 2) {
            tapCount++;
          } else {
            // Too slow, reset and start new tap sequence
            startTime = Date.now();
            startX = touch.clientX;
            startY = touch.clientY;
            tapCount = 1;
          }
        }
        
        // Clear any existing timeout
        if (timeout) {
          clearTimeout(timeout);
        }
        
        // Set timeout to detect end of tap sequence
        timeout = setTimeout(() => {
          resetState();
        }, maxDuration * 2);
      },
      
      onTouchEnd: (event) => {
        const touch = event.changedTouches[0];
        const timeDiff = Date.now() - startTime;
        
        // Calculate distance
        const distanceX = Math.abs(touch.clientX - startX);
        const distanceY = Math.abs(touch.clientY - startY);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Check if this is a valid tap
        if (timeDiff <= maxDuration && distance <= maxDistance) {
          if (tapCount === numberOfTaps) {
            onTap(event);
            resetState();
          }
        } else {
          // Invalid tap, reset
          resetState();
        }
      },
      
      onTouchCancel: resetState,
    };
  }

  /**
   * Create a pan gesture handler
   * @param {Function} onPan - Function to call when pan is detected
   * @param {Object} options - Gesture options
   * @returns {Object} Gesture handler
   */
  static createPanGesture(onPan, options = {}) {
    const {
      minDistance = 10,
      onStart,
      onEnd,
    } = options;
    
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    
    const resetState = () => {
      isPanning = false;
      startX = 0;
      startY = 0;
      lastX = 0;
      lastY = 0;
    };
    
    return {
      onTouchStart: (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        lastX = startX;
        lastY = startY;
      },
      
      onTouchMove: (event) => {
        const touch = event.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        
        // Calculate distance from start
        const distanceX = currentX - startX;
        const distanceY = currentY - startY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Calculate delta from last position
        const deltaX = currentX - lastX;
        const deltaY = currentY - lastY;
        
        if (!isPanning && distance >= minDistance) {
          isPanning = true;
          
          if (onStart) {
            onStart({
              nativeEvent: {
                x: currentX,
                y: currentY,
                absoluteX: currentX,
                absoluteY: currentY,
                translationX: distanceX,
                translationY: distanceY,
              },
            });
          }
        }
        
        if (isPanning) {
          onPan({
            nativeEvent: {
              x: currentX,
              y: currentY,
              absoluteX: currentX,
              absoluteY: currentY,
              translationX: distanceX,
              translationY: distanceY,
              velocityX: deltaX,
              velocityY: deltaY,
            },
          });
          
          lastX = currentX;
          lastY = currentY;
        }
      },
      
      onTouchEnd: (event) => {
        if (isPanning && onEnd) {
          const touch = event.changedTouches[0];
          
          onEnd({
            nativeEvent: {
              x: touch.clientX,
              y: touch.clientY,
              absoluteX: touch.clientX,
              absoluteY: touch.clientY,
              translationX: touch.clientX - startX,
              translationY: touch.clientY - startY,
            },
          });
        }
        
        resetState();
      },
      
      onTouchCancel: resetState,
    };
  }

  /**
   * Create a pinch gesture handler
   * @param {Function} onPinch - Function to call when pinch is detected
   * @param {Object} options - Gesture options
   * @returns {Object} Gesture handler
   */
  static createPinchGesture(onPinch, options = {}) {
    const {
      onStart,
      onEnd,
    } = options;
    
    let isPinching = false;
    let initialDistance = 0;
    let lastDistance = 0;
    
    const getDistance = (touches) => {
      if (touches.length < 2) {
        return 0;
      }
      
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    const resetState = () => {
      isPinching = false;
      initialDistance = 0;
      lastDistance = 0;
    };
    
    return {
      onTouchStart: (event) => {
        if (event.touches.length === 2) {
          initialDistance = getDistance(event.touches);
          lastDistance = initialDistance;
        }
      },
      
      onTouchMove: (event) => {
        if (event.touches.length < 2) {
          return;
        }
        
        const currentDistance = getDistance(event.touches);
        
        if (!isPinching) {
          isPinching = true;
          
          if (onStart) {
            onStart({
              nativeEvent: {
                scale: 1,
                velocity: 0,
                center: {
                  x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
                  y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
                },
              },
            });
          }
        }
        
        if (isPinching) {
          const scale = currentDistance / initialDistance;
          const velocity = currentDistance - lastDistance;
          
          onPinch({
            nativeEvent: {
              scale,
              velocity,
              center: {
                x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
                y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
              },
            },
          });
          
          lastDistance = currentDistance;
        }
      },
      
      onTouchEnd: (event) => {
        if (isPinching && onEnd) {
          onEnd({
            nativeEvent: {
              scale: lastDistance / initialDistance,
              velocity: 0,
            },
          });
        }
        
        resetState();
      },
      
      onTouchCancel: resetState,
    };
  }

  /**
   * Create a rotation gesture handler
   * @param {Function} onRotate - Function to call when rotation is detected
   * @param {Object} options - Gesture options
   * @returns {Object} Gesture handler
   */
  static createRotationGesture(onRotate, options = {}) {
    const {
      onStart,
      onEnd,
    } = options;
    
    let isRotating = false;
    let initialAngle = 0;
    let lastAngle = 0;
    
    const getAngle = (touches) => {
      if (touches.length < 2) {
        return 0;
      }
      
      return Math.atan2(
        touches[1].clientY - touches[0].clientY,
        touches[1].clientX - touches[0].clientX
      ) * 180 / Math.PI;
    };
    
    const resetState = () => {
      isRotating = false;
      initialAngle = 0;
      lastAngle = 0;
    };
    
    return {
      onTouchStart: (event) => {
        if (event.touches.length === 2) {
          initialAngle = getAngle(event.touches);
          lastAngle = initialAngle;
        }
      },
      
      onTouchMove: (event) => {
        if (event.touches.length < 2) {
          return;
        }
        
        const currentAngle = getAngle(event.touches);
        
        if (!isRotating) {
          isRotating = true;
          
          if (onStart) {
            onStart({
              nativeEvent: {
                rotation: 0,
                velocity: 0,
                center: {
                  x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
                  y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
                },
              },
            });
          }
        }
        
        if (isRotating) {
          let rotation = currentAngle - initialAngle;
          const velocity = currentAngle - lastAngle;
          
          // Normalize rotation to be between -180 and 180
          if (rotation > 180) rotation -= 360;
          if (rotation < -180) rotation += 360;
          
          onRotate({
            nativeEvent: {
              rotation,
              velocity,
              center: {
                x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
                y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
              },
            },
          });
          
          lastAngle = currentAngle;
        }
      },
      
      onTouchEnd: (event) => {
        if (isRotating && onEnd) {
          let rotation = lastAngle - initialAngle;
          
          // Normalize rotation to be between -180 and 180
          if (rotation > 180) rotation -= 360;
          if (rotation < -180) rotation += 360;
          
          onEnd({
            nativeEvent: {
              rotation,
              velocity: 0,
            },
          });
        }
        
        resetState();
      },
      
      onTouchCancel: resetState,
    };
  }
}

/**
 * Hook to use a gesture handler
 * @param {Object} gestureHandler - Gesture handler object
 * @returns {Object} Ref to attach to a component
 */
export function useGestureHandler(gestureHandler) {
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    
    if (!element) {
      return;
    }
    
    // Attach event listeners
    if (gestureHandler.onTouchStart) {
      element.addEventListener('touchstart', gestureHandler.onTouchStart);
    }
    
    if (gestureHandler.onTouchMove) {
      element.addEventListener('touchmove', gestureHandler.onTouchMove);
    }
    
    if (gestureHandler.onTouchEnd) {
      element.addEventListener('touchend', gestureHandler.onTouchEnd);
    }
    
    if (gestureHandler.onTouchCancel) {
      element.addEventListener('touchcancel', gestureHandler.onTouchCancel);
    }
    
    // Clean up
    return () => {
      if (gestureHandler.onTouchStart) {
        element.removeEventListener('touchstart', gestureHandler.onTouchStart);
      }
      
      if (gestureHandler.onTouchMove) {
        element.removeEventListener('touchmove', gestureHandler.onTouchMove);
      }
      
      if (gestureHandler.onTouchEnd) {
        element.removeEventListener('touchend', gestureHandler.onTouchEnd);
      }
      
      if (gestureHandler.onTouchCancel) {
        element.removeEventListener('touchcancel', gestureHandler.onTouchCancel);
      }
    };
  }, [gestureHandler]);
  
  return ref;
}

export { Gesture };
