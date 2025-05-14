/**
 * AccessibilityInfo utility for Reactive chmlsh
 * Provides information about the accessibility features available on the device
 */

/**
 * AccessibilityInfo class
 */
class AccessibilityInfo {
  static _screenReaderEnabled = false;
  static _reduceMotionEnabled = false;
  static _reduceTransparencyEnabled = false;
  static _boldTextEnabled = false;
  static _grayscaleEnabled = false;
  static _invertColorsEnabled = false;
  static _listeners = {
    screenReaderChanged: [],
    reduceMotionChanged: [],
    reduceTransparencyChanged: [],
    boldTextChanged: [],
    grayscaleChanged: [],
    invertColorsChanged: [],
  };

  /**
   * Check if a screen reader is currently enabled
   * @returns {Promise<boolean>} Promise that resolves to a boolean
   */
  static async isScreenReaderEnabled() {
    // Check if the browser supports screen readers
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        // Check for prefers-reduced-motion media query
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // This is not a perfect check, but it's a reasonable approximation
        this._screenReaderEnabled = prefersReducedMotion;
        
        return this._screenReaderEnabled;
      } catch (error) {
        console.error('Error checking screen reader status:', error);
      }
    }
    
    return false;
  }

  /**
   * Add an event listener for screen reader status changes
   * @param {string} eventName - Name of the event to listen for
   * @param {Function} handler - Function to call when the event occurs
   * @returns {Object} Subscription object with remove method
   */
  static addEventListener(eventName, handler) {
    if (!this._listeners[eventName]) {
      console.warn(`Invalid event name: ${eventName}`);
      return { remove: () => {} };
    }
    
    this._listeners[eventName].push(handler);
    
    // Set up media query listeners if this is the first subscriber
    if (eventName === 'screenReaderChanged' && this._listeners.screenReaderChanged.length === 1) {
      this._setupScreenReaderListener();
    } else if (eventName === 'reduceMotionChanged' && this._listeners.reduceMotionChanged.length === 1) {
      this._setupReduceMotionListener();
    } else if (eventName === 'reduceTransparencyChanged' && this._listeners.reduceTransparencyChanged.length === 1) {
      this._setupReduceTransparencyListener();
    } else if (eventName === 'boldTextChanged' && this._listeners.boldTextChanged.length === 1) {
      this._setupBoldTextListener();
    } else if (eventName === 'grayscaleChanged' && this._listeners.grayscaleChanged.length === 1) {
      this._setupGrayscaleListener();
    } else if (eventName === 'invertColorsChanged' && this._listeners.invertColorsChanged.length === 1) {
      this._setupInvertColorsListener();
    }
    
    return {
      remove: () => this.removeEventListener(eventName, handler),
    };
  }

  /**
   * Remove an event listener
   * @param {string} eventName - Name of the event
   * @param {Function} handler - Function to remove
   */
  static removeEventListener(eventName, handler) {
    if (!this._listeners[eventName]) {
      return;
    }
    
    const index = this._listeners[eventName].indexOf(handler);
    if (index !== -1) {
      this._listeners[eventName].splice(index, 1);
    }
  }

  /**
   * Set up screen reader listener
   * @private
   */
  static _setupScreenReaderListener() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      const handleChange = (event) => {
        this._screenReaderEnabled = event.matches;
        this._notifyListeners('screenReaderChanged', this._screenReaderEnabled);
      };
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }
    }
  }

  /**
   * Set up reduce motion listener
   * @private
   */
  static _setupReduceMotionListener() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      const handleChange = (event) => {
        this._reduceMotionEnabled = event.matches;
        this._notifyListeners('reduceMotionChanged', this._reduceMotionEnabled);
      };
      
      // Initial check
      this._reduceMotionEnabled = mediaQuery.matches;
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }
    }
  }

  /**
   * Set up reduce transparency listener
   * @private
   */
  static _setupReduceTransparencyListener() {
    // This is not directly supported in browsers, but we can approximate
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-transparency)');
      
      const handleChange = (event) => {
        this._reduceTransparencyEnabled = event.matches;
        this._notifyListeners('reduceTransparencyChanged', this._reduceTransparencyEnabled);
      };
      
      // Initial check
      this._reduceTransparencyEnabled = mediaQuery.matches;
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }
    }
  }

  /**
   * Set up bold text listener
   * @private
   */
  static _setupBoldTextListener() {
    // Not directly supported in browsers
  }

  /**
   * Set up grayscale listener
   * @private
   */
  static _setupGrayscaleListener() {
    // Not directly supported in browsers
  }

  /**
   * Set up invert colors listener
   * @private
   */
  static _setupInvertColorsListener() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(inverted-colors: inverted)');
      
      const handleChange = (event) => {
        this._invertColorsEnabled = event.matches;
        this._notifyListeners('invertColorsChanged', this._invertColorsEnabled);
      };
      
      // Initial check
      this._invertColorsEnabled = mediaQuery.matches;
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }
    }
  }

  /**
   * Notify listeners of a change
   * @param {string} eventName - Name of the event
   * @param {boolean} value - New value
   * @private
   */
  static _notifyListeners(eventName, value) {
    if (!this._listeners[eventName]) {
      return;
    }
    
    this._listeners[eventName].forEach(listener => {
      listener(value);
    });
  }

  /**
   * Check if reduce motion is enabled
   * @returns {Promise<boolean>} Promise that resolves to a boolean
   */
  static async isReduceMotionEnabled() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this._reduceMotionEnabled = mediaQuery.matches;
        return this._reduceMotionEnabled;
      } catch (error) {
        console.error('Error checking reduce motion status:', error);
      }
    }
    
    return false;
  }

  /**
   * Check if reduce transparency is enabled
   * @returns {Promise<boolean>} Promise that resolves to a boolean
   */
  static async isReduceTransparencyEnabled() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-reduced-transparency)');
        this._reduceTransparencyEnabled = mediaQuery.matches;
        return this._reduceTransparencyEnabled;
      } catch (error) {
        console.error('Error checking reduce transparency status:', error);
      }
    }
    
    return false;
  }

  /**
   * Check if bold text is enabled
   * @returns {Promise<boolean>} Promise that resolves to a boolean
   */
  static async isBoldTextEnabled() {
    // Not directly supported in browsers
    return false;
  }

  /**
   * Check if grayscale is enabled
   * @returns {Promise<boolean>} Promise that resolves to a boolean
   */
  static async isGrayscaleEnabled() {
    // Not directly supported in browsers
    return false;
  }

  /**
   * Check if invert colors is enabled
   * @returns {Promise<boolean>} Promise that resolves to a boolean
   */
  static async isInvertColorsEnabled() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(inverted-colors: inverted)');
        this._invertColorsEnabled = mediaQuery.matches;
        return this._invertColorsEnabled;
      } catch (error) {
        console.error('Error checking invert colors status:', error);
      }
    }
    
    return false;
  }

  /**
   * Announce a message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - Priority of the announcement ('polite' or 'assertive')
   */
  static announceForAccessibility(message, priority = 'polite') {
    if (typeof document === 'undefined') {
      return;
    }
    
    // Create or get the live region element
    let liveRegion = document.getElementById('chmlsh-accessibility-live-region');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'chmlsh-accessibility-live-region';
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clip = 'rect(0, 0, 0, 0)';
      liveRegion.style.whiteSpace = 'nowrap';
      document.body.appendChild(liveRegion);
    }
    
    // Set the appropriate aria-live attribute
    liveRegion.setAttribute('aria-live', priority);
    
    // Clear the region first
    liveRegion.textContent = '';
    
    // Set the message after a small delay to ensure it's announced
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

export { AccessibilityInfo };
