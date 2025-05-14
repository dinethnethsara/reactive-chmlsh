/**
 * Dimensions utility for Reactive chmlsh
 * Provides screen dimensions and responsive design utilities
 */

/**
 * Event listeners for dimension changes
 * @type {Array}
 * @private
 */
const _dimensionListeners = [];

/**
 * Dimensions utility class
 */
class Dimensions {
  /**
   * Get window dimensions
   * @returns {Object} Object containing window width and height
   */
  static get() {
    if (typeof window !== 'undefined') {
      return {
        window: {
          width: window.innerWidth,
          height: window.innerHeight,
          scale: window.devicePixelRatio || 1,
          fontScale: 1 // Default to 1 for web
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          scale: window.devicePixelRatio || 1,
          fontScale: 1 // Default to 1 for web
        }
      };
    }
    
    // Fallback for non-browser environments
    return {
      window: { width: 0, height: 0, scale: 1, fontScale: 1 },
      screen: { width: 0, height: 0, scale: 1, fontScale: 1 }
    };
  }

  /**
   * Add an event listener for dimension changes
   * @param {string} eventType - Event type to listen for
   * @param {Function} handler - Function to call when dimensions change
   * @returns {Object} Subscription object with remove method
   */
  static addEventListener(eventType, handler) {
    if (eventType !== 'change') {
      console.warn(`Dimensions.addEventListener: eventType '${eventType}' is not supported`);
      return { remove: () => {} };
    }
    
    _dimensionListeners.push(handler);
    
    // Set up window resize listener if this is the first subscriber
    if (_dimensionListeners.length === 1 && typeof window !== 'undefined') {
      window.addEventListener('resize', this._handleWindowResize);
    }
    
    return {
      remove: () => this.removeEventListener(eventType, handler)
    };
  }

  /**
   * Remove an event listener for dimension changes
   * @param {string} eventType - Event type to remove listener for
   * @param {Function} handler - Function to remove
   */
  static removeEventListener(eventType, handler) {
    if (eventType !== 'change') {
      return;
    }
    
    const index = _dimensionListeners.indexOf(handler);
    if (index !== -1) {
      _dimensionListeners.splice(index, 1);
    }
    
    // Remove window resize listener if there are no more subscribers
    if (_dimensionListeners.length === 0 && typeof window !== 'undefined') {
      window.removeEventListener('resize', this._handleWindowResize);
    }
  }

  /**
   * Handle window resize events
   * @private
   */
  static _handleWindowResize = () => {
    const dimensions = this.get();
    _dimensionListeners.forEach(listener => {
      listener(dimensions);
    });
  }
}

export { Dimensions };
