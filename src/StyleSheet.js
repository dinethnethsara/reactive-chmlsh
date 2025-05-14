/**
 * StyleSheet utility for Reactive chmlsh
 * Provides a way to create and manage styles similar to React Native
 */

/**
 * StyleSheet class for creating and managing styles
 */
class StyleSheet {
  /**
   * Create a stylesheet object from a style definition
   * @param {Object} styles - Object containing style definitions
   * @returns {Object} Processed style object
   */
  static create(styles) {
    const processedStyles = {};
    
    for (const key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        processedStyles[key] = this._processStyle(styles[key]);
      }
    }
    
    return processedStyles;
  }
  
  /**
   * Process a single style object
   * @param {Object} style - Style object to process
   * @returns {Object} Processed style object
   * @private
   */
  static _processStyle(style) {
    // Convert React Native-like styles to CSS-compatible styles
    const processedStyle = { ...style };
    
    // Handle special properties
    if (processedStyle.shadowColor && processedStyle.shadowOpacity) {
      processedStyle.boxShadow = this._createBoxShadow(processedStyle);
      delete processedStyle.shadowColor;
      delete processedStyle.shadowOpacity;
      delete processedStyle.shadowRadius;
      delete processedStyle.shadowOffset;
    }
    
    // Convert camelCase to kebab-case for CSS properties
    for (const key in processedStyle) {
      if (Object.prototype.hasOwnProperty.call(processedStyle, key)) {
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (kebabKey !== key) {
          processedStyle[kebabKey] = processedStyle[key];
          delete processedStyle[key];
        }
      }
    }
    
    return processedStyle;
  }
  
  /**
   * Create a box shadow CSS property from React Native shadow properties
   * @param {Object} style - Style object containing shadow properties
   * @returns {string} CSS box-shadow property
   * @private
   */
  static _createBoxShadow(style) {
    const { shadowColor, shadowOpacity, shadowRadius, shadowOffset } = style;
    const offsetX = shadowOffset?.width || 0;
    const offsetY = shadowOffset?.height || 0;
    const blur = shadowRadius || 0;
    
    // Convert color and opacity to rgba
    const rgba = this._colorWithOpacity(shadowColor, shadowOpacity);
    
    return `${offsetX}px ${offsetY}px ${blur}px ${rgba}`;
  }
  
  /**
   * Convert color and opacity to rgba format
   * @param {string} color - Color in hex or rgb format
   * @param {number} opacity - Opacity value between 0 and 1
   * @returns {string} Color in rgba format
   * @private
   */
  static _colorWithOpacity(color, opacity) {
    // Simple implementation for hex colors
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    return color;
  }
  
  /**
   * Flatten an array of style objects into a single style object
   * @param {...Object} styles - Style objects to flatten
   * @returns {Object} Flattened style object
   */
  static flatten(...styles) {
    return Object.assign({}, ...styles.filter(Boolean));
  }
}

export { StyleSheet };
