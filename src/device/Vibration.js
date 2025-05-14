/**
 * Vibration utility for Reactive chmlsh
 * A utility for controlling device vibration
 */

/**
 * Vibration class
 */
class Vibration {
  /**
   * Check if vibration is supported
   * @returns {boolean} Whether vibration is supported
   */
  static isSupported() {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  /**
   * Vibrate with a pattern
   * @param {number|number[]} pattern - Vibration pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrate(pattern) {
    if (!Vibration.isSupported()) {
      console.warn('Vibration is not supported in this environment');
      return false;
    }
    
    try {
      navigator.vibrate(pattern);
      return true;
    } catch (error) {
      console.error('Error vibrating:', error);
      return false;
    }
  }

  /**
   * Cancel vibration
   * @returns {boolean} Whether cancellation was successful
   */
  static cancel() {
    if (!Vibration.isSupported()) {
      console.warn('Vibration is not supported in this environment');
      return false;
    }
    
    try {
      navigator.vibrate(0);
      return true;
    } catch (error) {
      console.error('Error canceling vibration:', error);
      return false;
    }
  }

  /**
   * Vibrate with a short pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateShort() {
    return Vibration.vibrate(50);
  }

  /**
   * Vibrate with a medium pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateMedium() {
    return Vibration.vibrate(100);
  }

  /**
   * Vibrate with a long pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateLong() {
    return Vibration.vibrate(500);
  }

  /**
   * Vibrate with a double pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateDouble() {
    return Vibration.vibrate([50, 100, 50]);
  }

  /**
   * Vibrate with a triple pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateTriple() {
    return Vibration.vibrate([50, 100, 50, 100, 50]);
  }

  /**
   * Vibrate with an error pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateError() {
    return Vibration.vibrate([100, 50, 100, 50, 100]);
  }

  /**
   * Vibrate with a success pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateSuccess() {
    return Vibration.vibrate([50, 50, 100]);
  }

  /**
   * Vibrate with a warning pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateWarning() {
    return Vibration.vibrate([100, 50, 100]);
  }

  /**
   * Vibrate with an SOS pattern
   * @returns {boolean} Whether vibration was successful
   */
  static vibrateSOS() {
    // SOS in Morse code: ... --- ...
    return Vibration.vibrate([
      100, 100, 100, 100, 100, 100,
      300, 100, 300, 100, 300, 100,
      100, 100, 100, 100, 100
    ]);
  }
}

export { Vibration };
