/**
 * Animation presets for Reactive chmlsh
 * Predefined animation configurations for common use cases
 */

import { Animated } from '../Animated';

/**
 * Easing functions
 */
const Easing = {
  linear: t => t,
  
  easeIn: t => t * t,
  easeOut: t => t * (2 - t),
  easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + (--t) * t * t * t * t,
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  
  easeInElastic: t => (.04 - .04 / t) * Math.sin(25 * t) + 1,
  easeOutElastic: t => .04 * t / (--t) * Math.sin(25 * t),
  easeInOutElastic: t => (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1,
  
  easeInBounce: t => 1 - Easing.easeOutBounce(1 - t),
  easeOutBounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInOutBounce: t => t < 0.5 ? Easing.easeInBounce(t * 2) * 0.5 : Easing.easeOutBounce(t * 2 - 1) * 0.5 + 0.5,
};

/**
 * Animation presets
 */
const AnimationPresets = {
  /**
   * Fade in animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  fadeIn: (value, config = {}) => {
    const {
      duration = 300,
      easing = Easing.easeInOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 1,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Fade out animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  fadeOut: (value, config = {}) => {
    const {
      duration = 300,
      easing = Easing.easeInOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Slide in from left animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  slideInLeft: (value, config = {}) => {
    const {
      duration = 300,
      easing = Easing.easeOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Slide in from right animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  slideInRight: (value, config = {}) => {
    const {
      duration = 300,
      easing = Easing.easeOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Slide in from top animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  slideInTop: (value, config = {}) => {
    const {
      duration = 300,
      easing = Easing.easeOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Slide in from bottom animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  slideInBottom: (value, config = {}) => {
    const {
      duration = 300,
      easing = Easing.easeOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Zoom in animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  zoomIn: (value, config = {}) => {
    const {
      duration = 300,
      easing = Easing.easeOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 1,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Zoom out animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  zoomOut: (value, config = {}) => {
    const {
      duration = 300,
      easing = Easing.easeOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Bounce animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  bounce: (value, config = {}) => {
    const {
      duration = 800,
      easing = Easing.easeOutBounce,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.timing(value, {
      toValue: 1,
      duration,
      easing,
      delay,
      useNativeDriver,
    });
  },
  
  /**
   * Pulse animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  pulse: (value, config = {}) => {
    const {
      duration = 1000,
      easing = Easing.easeInOut,
      delay = 0,
      useNativeDriver = true,
    } = config;
    
    return Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: duration / 2,
        easing,
        delay,
        useNativeDriver,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: duration / 2,
        easing,
        useNativeDriver,
      }),
    ]);
  },
  
  /**
   * Shake animation
   * @param {Animated.Value} value - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  shake: (value, config = {}) => {
    const {
      duration = 600,
      easing = Easing.easeOut,
      delay = 0,
      useNativeDriver = true,
      intensity = 10,
    } = config;
    
    return Animated.sequence([
      Animated.timing(value, {
        toValue: intensity,
        duration: duration / 5,
        easing,
        delay,
        useNativeDriver,
      }),
      Animated.timing(value, {
        toValue: -intensity,
        duration: duration / 5,
        easing,
        useNativeDriver,
      }),
      Animated.timing(value, {
        toValue: intensity / 2,
        duration: duration / 5,
        easing,
        useNativeDriver,
      }),
      Animated.timing(value, {
        toValue: -intensity / 2,
        duration: duration / 5,
        easing,
        useNativeDriver,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: duration / 5,
        easing,
        useNativeDriver,
      }),
    ]);
  },
};

export { AnimationPresets, Easing };
