/**
 * Battery utility for Reactive chmlsh
 * A utility for accessing device battery information
 */

/**
 * Battery class
 */
class Battery {
  static _battery = null;
  static _listeners = {
    change: [],
    levelChange: [],
    chargingChange: [],
    lowChange: [],
  };

  /**
   * Initialize battery
   * @returns {Promise<void>}
   */
  static async initialize() {
    if (typeof navigator === 'undefined' || !navigator.getBattery) {
      console.warn('Battery API is not supported in this environment');
      return;
    }
    
    try {
      Battery._battery = await navigator.getBattery();
      
      // Set up event listeners
      Battery._battery.addEventListener('chargingchange', Battery._handleChargingChange);
      Battery._battery.addEventListener('levelchange', Battery._handleLevelChange);
      Battery._battery.addEventListener('chargingtimechange', Battery._handleChange);
      Battery._battery.addEventListener('dischargingtimechange', Battery._handleChange);
    } catch (error) {
      console.error('Error initializing battery:', error);
    }
  }

  /**
   * Get battery info
   * @returns {Object} Battery info
   */
  static getBatteryInfo() {
    if (!Battery._battery) {
      return {
        level: 1,
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        lowBattery: false,
      };
    }
    
    return {
      level: Battery._battery.level,
      charging: Battery._battery.charging,
      chargingTime: Battery._battery.chargingTime,
      dischargingTime: Battery._battery.dischargingTime,
      lowBattery: Battery._battery.level <= 0.2,
    };
  }

  /**
   * Get battery level
   * @returns {number} Battery level
   */
  static getBatteryLevel() {
    if (!Battery._battery) {
      return 1;
    }
    
    return Battery._battery.level;
  }

  /**
   * Check if battery is charging
   * @returns {boolean} Whether battery is charging
   */
  static isCharging() {
    if (!Battery._battery) {
      return true;
    }
    
    return Battery._battery.charging;
  }

  /**
   * Get charging time
   * @returns {number} Charging time
   */
  static getChargingTime() {
    if (!Battery._battery) {
      return 0;
    }
    
    return Battery._battery.chargingTime;
  }

  /**
   * Get discharging time
   * @returns {number} Discharging time
   */
  static getDischargingTime() {
    if (!Battery._battery) {
      return Infinity;
    }
    
    return Battery._battery.dischargingTime;
  }

  /**
   * Check if battery is low
   * @returns {boolean} Whether battery is low
   */
  static isLowBattery() {
    if (!Battery._battery) {
      return false;
    }
    
    return Battery._battery.level <= 0.2;
  }

  /**
   * Add battery change listener
   * @param {string} event - Event to listen for
   * @param {Function} listener - Listener function
   * @returns {Function} Unsubscribe function
   */
  static addListener(event, listener) {
    if (!Battery._listeners[event]) {
      console.warn(`Invalid event: ${event}`);
      return () => {};
    }
    
    Battery._listeners[event].push(listener);
    
    return () => {
      Battery._listeners[event] = Battery._listeners[event].filter(l => l !== listener);
    };
  }

  /**
   * Handle charging change
   * @returns {void}
   * @private
   */
  static _handleChargingChange = () => {
    if (!Battery._battery) {
      return;
    }
    
    const info = Battery.getBatteryInfo();
    
    // Notify change listeners
    Battery._notifyListeners('change', info);
    
    // Notify charging change listeners
    Battery._notifyListeners('chargingChange', info.charging);
  };

  /**
   * Handle level change
   * @returns {void}
   * @private
   */
  static _handleLevelChange = () => {
    if (!Battery._battery) {
      return;
    }
    
    const info = Battery.getBatteryInfo();
    
    // Notify change listeners
    Battery._notifyListeners('change', info);
    
    // Notify level change listeners
    Battery._notifyListeners('levelChange', info.level);
    
    // Check if low battery state changed
    const isLow = info.level <= 0.2;
    
    if (isLow !== Battery._isLow) {
      Battery._isLow = isLow;
      Battery._notifyListeners('lowChange', isLow);
    }
  };

  /**
   * Handle general change
   * @returns {void}
   * @private
   */
  static _handleChange = () => {
    if (!Battery._battery) {
      return;
    }
    
    const info = Battery.getBatteryInfo();
    
    // Notify change listeners
    Battery._notifyListeners('change', info);
  };

  /**
   * Notify listeners
   * @param {string} event - Event name
   * @param {any} data - Event data
   * @returns {void}
   * @private
   */
  static _notifyListeners(event, data) {
    if (!Battery._listeners[event]) {
      return;
    }
    
    for (const listener of Battery._listeners[event]) {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in battery ${event} listener:`, error);
      }
    }
  }
}

export { Battery };
