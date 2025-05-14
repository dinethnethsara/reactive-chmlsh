/**
 * useAnimation hook for Reactive chmlsh
 * A hook for creating and controlling animations
 */

import { useState, useEffect, useRef } from 'react';
import { Animated } from '../Animated';
import { AnimationPresets, Easing } from './AnimationPresets';

/**
 * Hook for creating and controlling animations
 * @param {Object} options - Animation options
 * @returns {Object} Animation controls and values
 */
const useAnimation = (options = {}) => {
  const {
    type = 'timing',
    initialValue = 0,
    toValue = 1,
    duration = 300,
    easing = Easing.easeInOut,
    delay = 0,
    useNativeDriver = true,
    autoPlay = false,
    loop = false,
    boomerang = false,
  } = options;

  // Create animated value
  const [animatedValue] = useState(new Animated.Value(initialValue));
  
  // Track animation state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFinished, setIsFinished] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  
  // Store animation reference
  const animationRef = useRef(null);
  
  // Store options for updates
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Update current value when animated value changes
  useEffect(() => {
    const id = animatedValue.addListener(({ value }) => {
      setCurrentValue(value);
    });
    
    return () => {
      animatedValue.removeListener(id);
    };
  }, [animatedValue]);

  // Create animation based on type
  const createAnimation = (config = {}) => {
    const {
      type: animationType = type,
      toValue: animationToValue = toValue,
      duration: animationDuration = duration,
      easing: animationEasing = easing,
      delay: animationDelay = delay,
      useNativeDriver: animationUseNativeDriver = useNativeDriver,
    } = config;
    
    switch (animationType) {
      case 'spring':
        return Animated.spring(animatedValue, {
          toValue: animationToValue,
          friction: config.friction || 7,
          tension: config.tension || 40,
          useNativeDriver: animationUseNativeDriver,
        });
      case 'decay':
        return Animated.decay(animatedValue, {
          velocity: config.velocity || 0.5,
          deceleration: config.deceleration || 0.997,
          useNativeDriver: animationUseNativeDriver,
        });
      case 'timing':
      default:
        return Animated.timing(animatedValue, {
          toValue: animationToValue,
          duration: animationDuration,
          easing: animationEasing,
          delay: animationDelay,
          useNativeDriver: animationUseNativeDriver,
        });
    }
  };

  // Start animation
  const start = (config = {}) => {
    // Stop any running animation
    stop();
    
    setIsPlaying(true);
    setIsFinished(false);
    
    // Create animation
    let animation;
    
    if (loop) {
      if (boomerang) {
        // Create sequence for boomerang effect
        const forward = createAnimation(config);
        const backward = createAnimation({
          ...config,
          toValue: initialValue,
        });
        
        animation = Animated.loop(Animated.sequence([forward, backward]));
      } else {
        // Create simple loop
        animation = Animated.loop(createAnimation(config));
      }
    } else if (boomerang) {
      // Create sequence for boomerang effect
      const forward = createAnimation(config);
      const backward = createAnimation({
        ...config,
        toValue: initialValue,
      });
      
      animation = Animated.sequence([forward, backward]);
    } else {
      // Create simple animation
      animation = createAnimation(config);
    }
    
    // Store animation reference
    animationRef.current = animation;
    
    // Start animation
    animation.start(({ finished }) => {
      if (finished) {
        setIsPlaying(false);
        setIsFinished(true);
        
        if (config.onComplete) {
          config.onComplete();
        }
      }
    });
  };

  // Stop animation
  const stop = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    
    setIsPlaying(false);
  };

  // Reset animation
  const reset = () => {
    stop();
    animatedValue.setValue(initialValue);
    setCurrentValue(initialValue);
    setIsFinished(false);
  };

  // Restart animation
  const restart = (config = {}) => {
    reset();
    start(config);
  };

  // Start animation on mount if autoPlay is true
  useEffect(() => {
    if (autoPlay) {
      start();
    }
    
    return () => {
      stop();
    };
  }, []);

  // Create interpolation function
  const interpolate = (config) => {
    return animatedValue.interpolate(config);
  };

  // Apply animation to style
  const applyAnimation = (styleProperty, interpolationConfig) => {
    if (interpolationConfig) {
      return {
        [styleProperty]: interpolate(interpolationConfig),
      };
    }
    
    return {
      [styleProperty]: animatedValue,
    };
  };

  // Apply common animations
  const animations = {
    opacity: (config) => applyAnimation('opacity', config),
    translateX: (config) => ({
      transform: [{ translateX: config ? interpolate(config) : animatedValue }],
    }),
    translateY: (config) => ({
      transform: [{ translateY: config ? interpolate(config) : animatedValue }],
    }),
    scale: (config) => ({
      transform: [{ scale: config ? interpolate(config) : animatedValue }],
    }),
    scaleX: (config) => ({
      transform: [{ scaleX: config ? interpolate(config) : animatedValue }],
    }),
    scaleY: (config) => ({
      transform: [{ scaleY: config ? interpolate(config) : animatedValue }],
    }),
    rotate: (config) => ({
      transform: [
        {
          rotate: config
            ? interpolate(config)
            : animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
        },
      ],
    }),
  };

  return {
    value: animatedValue,
    currentValue,
    isPlaying,
    isFinished,
    start,
    stop,
    reset,
    restart,
    interpolate,
    animations,
  };
};

export { useAnimation };
