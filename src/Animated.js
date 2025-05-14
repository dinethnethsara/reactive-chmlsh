/**
 * Animated utility for Reactive chmlsh
 * Provides animation capabilities similar to React Native's Animated
 */

import React from 'react';

/**
 * Animated value class
 */
class AnimatedValue {
  /**
   * Create a new animated value
   * @param {number} initialValue - Initial value
   */
  constructor(initialValue) {
    this._value = initialValue;
    this._listeners = [];
    this._animations = [];
  }

  /**
   * Get the current value
   * @returns {number} Current value
   */
  getValue() {
    return this._value;
  }

  /**
   * Set the value directly
   * @param {number} value - New value
   */
  setValue(value) {
    this._value = value;
    this._notifyListeners();
  }

  /**
   * Add a listener for value changes
   * @param {Function} callback - Function to call when value changes
   * @returns {string} Listener ID
   */
  addListener(callback) {
    const id = String(this._listeners.length);
    this._listeners.push({ id, callback });
    return id;
  }

  /**
   * Remove a listener
   * @param {string} id - Listener ID to remove
   */
  removeListener(id) {
    const index = this._listeners.findIndex(listener => listener.id === id);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    this._listeners = [];
  }

  /**
   * Notify all listeners of value change
   * @private
   */
  _notifyListeners() {
    this._listeners.forEach(listener => {
      listener.callback({ value: this._value });
    });
  }

  /**
   * Interpolate the value to a different range
   * @param {Object} config - Interpolation configuration
   * @returns {Object} Interpolated value object
   */
  interpolate(config) {
    return {
      _parent: this,
      _inputRange: config.inputRange || [0, 1],
      _outputRange: config.outputRange || [0, 1],
      _easing: config.easing || (t => t),
      _extrapolate: config.extrapolate || 'extend',
      
      /**
       * Get the interpolated value
       * @returns {*} Interpolated value
       */
      getValue() {
        const value = this._parent.getValue();
        return this._interpolate(value);
      },
      
      /**
       * Interpolate a value
       * @param {number} value - Value to interpolate
       * @returns {*} Interpolated value
       * @private
       */
      _interpolate(value) {
        const { _inputRange, _outputRange, _easing, _extrapolate } = this;
        
        // Find the segment that contains the value
        let i;
        for (i = 0; i < _inputRange.length - 1; i++) {
          if (value >= _inputRange[i] && value <= _inputRange[i + 1]) {
            break;
          }
        }
        
        if (i === _inputRange.length - 1) {
          // Value is outside the input range
          if (_extrapolate === 'clamp') {
            return value <= _inputRange[0] ? _outputRange[0] : _outputRange[_outputRange.length - 1];
          }
        }
        
        // Calculate the interpolated value
        const inputMin = _inputRange[i];
        const inputMax = _inputRange[i + 1];
        const outputMin = _outputRange[i];
        const outputMax = _outputRange[i + 1];
        
        // Normalize the value in the input range
        const normalizedValue = (value - inputMin) / (inputMax - inputMin);
        
        // Apply easing
        const easedValue = _easing(normalizedValue);
        
        // Map to output range
        return outputMin + easedValue * (outputMax - outputMin);
      }
    };
  }
}

/**
 * Animated component class
 */
class Animated {
  /**
   * Create a new animated value
   * @param {number} initialValue - Initial value
   * @returns {AnimatedValue} Animated value object
   */
  static Value(initialValue) {
    return new AnimatedValue(initialValue);
  }

  /**
   * Create an animated component
   * @param {React.Component} Component - Component to animate
   * @returns {React.Component} Animated component
   */
  static createAnimatedComponent(Component) {
    return class AnimatedComponent extends React.Component {
      render() {
        const { style, ...otherProps } = this.props;
        
        // Process animated styles
        const flattenedStyle = this._processStyle(style);
        
        return <Component style={flattenedStyle} {...otherProps} />;
      }
      
      /**
       * Process animated styles
       * @param {Object} style - Style object
       * @returns {Object} Processed style object
       * @private
       */
      _processStyle(style) {
        if (!style) {
          return {};
        }
        
        const flattenedStyle = {};
        
        // Handle array of styles
        if (Array.isArray(style)) {
          return Object.assign({}, ...style.map(s => this._processStyle(s)));
        }
        
        // Process each style property
        for (const key in style) {
          if (Object.prototype.hasOwnProperty.call(style, key)) {
            const value = style[key];
            
            // Handle animated values
            if (value instanceof AnimatedValue) {
              flattenedStyle[key] = value.getValue();
            } else if (value && typeof value === 'object' && value.getValue) {
              // Handle interpolated values
              flattenedStyle[key] = value.getValue();
            } else {
              flattenedStyle[key] = value;
            }
          }
        }
        
        return flattenedStyle;
      }
    };
  }

  /**
   * Timing animation
   * @param {AnimatedValue} value - Animated value to animate
   * @param {Object} config - Animation configuration
   * @returns {Object} Animation object
   */
  static timing(value, config) {
    return {
      _value: value,
      _toValue: config.toValue,
      _duration: config.duration || 500,
      _easing: config.easing || (t => t),
      _delay: config.delay || 0,
      _onComplete: config.onComplete,
      
      /**
       * Start the animation
       * @param {Object} options - Animation options
       */
      start(options = {}) {
        const { _value, _toValue, _duration, _easing, _delay, _onComplete } = this;
        const startValue = _value.getValue();
        const changeInValue = _toValue - startValue;
        const startTime = Date.now() + _delay;
        
        const step = () => {
          const now = Date.now();
          
          if (now < startTime) {
            // Still in delay period
            requestAnimationFrame(step);
            return;
          }
          
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / _duration, 1);
          const easedProgress = _easing(progress);
          const currentValue = startValue + easedProgress * changeInValue;
          
          _value.setValue(currentValue);
          
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            // Animation complete
            if (_onComplete) {
              _onComplete({ finished: true });
            }
            
            if (options.onComplete) {
              options.onComplete({ finished: true });
            }
          }
        };
        
        requestAnimationFrame(step);
      }
    };
  }
}

// Create animated components
Animated.View = Animated.createAnimatedComponent('div');
Animated.Text = Animated.createAnimatedComponent('span');
Animated.Image = Animated.createAnimatedComponent('img');

export { Animated };
