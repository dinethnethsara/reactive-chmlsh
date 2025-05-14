/**
 * Platform utility for Reactive chmlsh
 * Provides platform-specific code and detection
 */

/**
 * Platform detection and utilities
 */
class Platform {
  /**
   * Platform constants
   */
  static OS = {
    WEB: 'web',
    ANDROID: 'android',
    IOS: 'ios',
    WINDOWS: 'windows',
    MACOS: 'macos',
    LINUX: 'linux'
  };

  /**
   * Get the current platform
   * @returns {string} Current platform identifier
   */
  static get OS() {
    // Detect platform based on user agent
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (userAgent.indexOf('android') > -1) {
        return this.OS.ANDROID;
      }
      
      if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1 || userAgent.indexOf('ipod') > -1) {
        return this.OS.IOS;
      }
      
      if (userAgent.indexOf('windows') > -1) {
        return this.OS.WINDOWS;
      }
      
      if (userAgent.indexOf('macintosh') > -1 || userAgent.indexOf('mac os x') > -1) {
        return this.OS.MACOS;
      }
      
      if (userAgent.indexOf('linux') > -1) {
        return this.OS.LINUX;
      }
    }
    
    return this.OS.WEB;
  }

  /**
   * Check if the current platform is Android
   * @returns {boolean} True if the platform is Android
   */
  static isAndroid() {
    return this.OS === this.OS.ANDROID;
  }

  /**
   * Check if the current platform is iOS
   * @returns {boolean} True if the platform is iOS
   */
  static isIOS() {
    return this.OS === this.OS.IOS;
  }

  /**
   * Check if the current platform is web
   * @returns {boolean} True if the platform is web
   */
  static isWeb() {
    return this.OS === this.OS.WEB;
  }

  /**
   * Select a value based on the platform
   * @param {Object} obj - Object with platform-specific values
   * @returns {*} The value for the current platform or the default value
   */
  static select(obj) {
    const platform = this.OS;
    
    if (obj.hasOwnProperty(platform)) {
      return obj[platform];
    }
    
    if (obj.hasOwnProperty('default')) {
      return obj.default;
    }
    
    return null;
  }
}

export { Platform };
