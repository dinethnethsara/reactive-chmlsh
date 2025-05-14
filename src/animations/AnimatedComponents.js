/**
 * Animated components for Reactive chmlsh
 * Pre-animated components with common animations
 */

import React, { useState, useEffect } from 'react';
import { Animated } from '../Animated';
import { View } from '../components/View';
import { AnimationPresets, Easing } from './AnimationPresets';

/**
 * FadeIn component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const FadeIn = (props) => {
  const {
    children,
    duration = 300,
    delay = 0,
    easing = Easing.easeInOut,
    initialOpacity = 0,
    finalOpacity = 1,
    useNativeDriver = true,
    style,
    onAnimationComplete,
    ...otherProps
  } = props;

  const [opacity] = useState(new Animated.Value(initialOpacity));

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: finalOpacity,
      duration,
      delay,
      easing,
      useNativeDriver,
    });

    animation.start(({ finished }) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => {
      animation.stop();
    };
  }, [opacity, duration, delay, easing, initialOpacity, finalOpacity, useNativeDriver, onAnimationComplete]);

  return (
    <Animated.View style={[{ opacity }, style]} {...otherProps}>
      {children}
    </Animated.View>
  );
};

/**
 * FadeOut component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const FadeOut = (props) => {
  const {
    children,
    duration = 300,
    delay = 0,
    easing = Easing.easeInOut,
    initialOpacity = 1,
    finalOpacity = 0,
    useNativeDriver = true,
    style,
    onAnimationComplete,
    ...otherProps
  } = props;

  const [opacity] = useState(new Animated.Value(initialOpacity));

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: finalOpacity,
      duration,
      delay,
      easing,
      useNativeDriver,
    });

    animation.start(({ finished }) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => {
      animation.stop();
    };
  }, [opacity, duration, delay, easing, initialOpacity, finalOpacity, useNativeDriver, onAnimationComplete]);

  return (
    <Animated.View style={[{ opacity }, style]} {...otherProps}>
      {children}
    </Animated.View>
  );
};

/**
 * SlideIn component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const SlideIn = (props) => {
  const {
    children,
    duration = 300,
    delay = 0,
    easing = Easing.easeOut,
    direction = 'left',
    distance = 100,
    useNativeDriver = true,
    style,
    onAnimationComplete,
    ...otherProps
  } = props;

  const [animation] = useState(new Animated.Value(distance));

  useEffect(() => {
    const animationConfig = {
      toValue: 0,
      duration,
      delay,
      easing,
      useNativeDriver,
    };

    const slideAnimation = Animated.timing(animation, animationConfig);

    slideAnimation.start(({ finished }) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => {
      slideAnimation.stop();
    };
  }, [animation, duration, delay, easing, distance, useNativeDriver, onAnimationComplete]);

  // Determine transform based on direction
  const getTransform = () => {
    switch (direction) {
      case 'right':
        return { transform: [{ translateX: animation }] };
      case 'up':
        return { transform: [{ translateY: animation }] };
      case 'down':
        return { transform: [{ translateY: animation }] };
      case 'left':
      default:
        return { transform: [{ translateX: animation }] };
    }
  };

  return (
    <Animated.View style={[getTransform(), style]} {...otherProps}>
      {children}
    </Animated.View>
  );
};

/**
 * ZoomIn component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const ZoomIn = (props) => {
  const {
    children,
    duration = 300,
    delay = 0,
    easing = Easing.easeOut,
    initialScale = 0,
    finalScale = 1,
    useNativeDriver = true,
    style,
    onAnimationComplete,
    ...otherProps
  } = props;

  const [scale] = useState(new Animated.Value(initialScale));

  useEffect(() => {
    const animation = Animated.timing(scale, {
      toValue: finalScale,
      duration,
      delay,
      easing,
      useNativeDriver,
    });

    animation.start(({ finished }) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => {
      animation.stop();
    };
  }, [scale, duration, delay, easing, initialScale, finalScale, useNativeDriver, onAnimationComplete]);

  return (
    <Animated.View
      style={[{ transform: [{ scale }] }, style]}
      {...otherProps}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Bounce component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Bounce = (props) => {
  const {
    children,
    duration = 800,
    delay = 0,
    easing = Easing.easeOutBounce,
    initialScale = 0.3,
    finalScale = 1,
    useNativeDriver = true,
    style,
    onAnimationComplete,
    ...otherProps
  } = props;

  const [scale] = useState(new Animated.Value(initialScale));

  useEffect(() => {
    const animation = Animated.timing(scale, {
      toValue: finalScale,
      duration,
      delay,
      easing,
      useNativeDriver,
    });

    animation.start(({ finished }) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => {
      animation.stop();
    };
  }, [scale, duration, delay, easing, initialScale, finalScale, useNativeDriver, onAnimationComplete]);

  return (
    <Animated.View
      style={[{ transform: [{ scale }] }, style]}
      {...otherProps}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Pulse component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Pulse = (props) => {
  const {
    children,
    duration = 1000,
    delay = 0,
    easing = Easing.easeInOut,
    minScale = 1,
    maxScale = 1.1,
    repeat = true,
    useNativeDriver = true,
    style,
    onAnimationComplete,
    ...otherProps
  } = props;

  const [scale] = useState(new Animated.Value(minScale));

  useEffect(() => {
    const pulseSequence = Animated.sequence([
      Animated.timing(scale, {
        toValue: maxScale,
        duration: duration / 2,
        easing,
        delay,
        useNativeDriver,
      }),
      Animated.timing(scale, {
        toValue: minScale,
        duration: duration / 2,
        easing,
        useNativeDriver,
      }),
    ]);

    const animation = repeat
      ? Animated.loop(pulseSequence)
      : pulseSequence;

    animation.start(({ finished }) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => {
      animation.stop();
    };
  }, [scale, duration, delay, easing, minScale, maxScale, repeat, useNativeDriver, onAnimationComplete]);

  return (
    <Animated.View
      style={[{ transform: [{ scale }] }, style]}
      {...otherProps}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Shake component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Shake = (props) => {
  const {
    children,
    duration = 600,
    delay = 0,
    easing = Easing.easeOut,
    intensity = 10,
    useNativeDriver = true,
    style,
    onAnimationComplete,
    ...otherProps
  } = props;

  const [translateX] = useState(new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(translateX, {
        toValue: intensity,
        duration: duration / 5,
        easing,
        delay,
        useNativeDriver,
      }),
      Animated.timing(translateX, {
        toValue: -intensity,
        duration: duration / 5,
        easing,
        useNativeDriver,
      }),
      Animated.timing(translateX, {
        toValue: intensity / 2,
        duration: duration / 5,
        easing,
        useNativeDriver,
      }),
      Animated.timing(translateX, {
        toValue: -intensity / 2,
        duration: duration / 5,
        easing,
        useNativeDriver,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: duration / 5,
        easing,
        useNativeDriver,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => {
      animation.stop();
    };
  }, [translateX, duration, delay, easing, intensity, useNativeDriver, onAnimationComplete]);

  return (
    <Animated.View
      style={[{ transform: [{ translateX }] }, style]}
      {...otherProps}
    >
      {children}
    </Animated.View>
  );
};

export {
  FadeIn,
  FadeOut,
  SlideIn,
  ZoomIn,
  Bounce,
  Pulse,
  Shake
};
