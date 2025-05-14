/**
 * DeviceInfo utility for Reactive chmlsh
 * A utility for getting device information
 */

import { Platform } from '../Platform';
import { Dimensions } from '../Dimensions';

/**
 * DeviceInfo class
 */
class DeviceInfo {
  static _cachedInfo = null;

  /**
   * Get device information
   * @returns {Object} Device information
   */
  static getInfo() {
    if (DeviceInfo._cachedInfo) {
      return { ...DeviceInfo._cachedInfo };
    }
    
    const dimensions = Dimensions.get().window;
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    
    const info = {
      platform: Platform.OS,
      version: DeviceInfo._getOSVersion(),
      isTablet: DeviceInfo._isTablet(dimensions, userAgent),
      brand: DeviceInfo._getBrand(userAgent),
      model: DeviceInfo._getModel(userAgent),
      deviceType: DeviceInfo._getDeviceType(dimensions, userAgent),
      deviceId: DeviceInfo._getDeviceId(),
      deviceName: DeviceInfo._getDeviceName(),
      isEmulator: DeviceInfo._isEmulator(userAgent),
      isLandscape: dimensions.width > dimensions.height,
      hasNotch: DeviceInfo._hasNotch(userAgent),
      hasSystemFeature: (feature) => DeviceInfo._hasSystemFeature(feature),
      supportedAbis: DeviceInfo._getSupportedAbis(),
      supported32BitAbis: DeviceInfo._getSupported32BitAbis(),
      supported64BitAbis: DeviceInfo._getSupported64BitAbis(),
      hasGms: DeviceInfo._hasGms(),
      hasHms: DeviceInfo._hasHms(),
      firstInstallTime: DeviceInfo._getFirstInstallTime(),
      lastUpdateTime: DeviceInfo._getLastUpdateTime(),
      batteryLevel: DeviceInfo._getBatteryLevel(),
      isBatteryCharging: DeviceInfo._isBatteryCharging(),
      isLowBattery: DeviceInfo._isLowBattery(),
      deviceLocale: DeviceInfo._getDeviceLocale(),
      deviceCountry: DeviceInfo._getDeviceCountry(),
      timezone: DeviceInfo._getTimezone(),
      carrier: DeviceInfo._getCarrier(),
      totalMemory: DeviceInfo._getTotalMemory(),
      maxMemory: DeviceInfo._getMaxMemory(),
      totalDiskCapacity: DeviceInfo._getTotalDiskCapacity(),
      freeDiskStorage: DeviceInfo._getFreeDiskStorage(),
      batteryState: DeviceInfo._getBatteryState(),
      powerState: DeviceInfo._getPowerState(),
      isAirplaneMode: DeviceInfo._isAirplaneMode(),
      isLocationEnabled: DeviceInfo._isLocationEnabled(),
      headphones: DeviceInfo._isHeadphonesConnected(),
      deviceToken: DeviceInfo._getDeviceToken(),
      uniqueId: DeviceInfo._getUniqueId(),
      appName: DeviceInfo._getAppName(),
      bundleId: DeviceInfo._getBundleId(),
      appVersion: DeviceInfo._getAppVersion(),
      buildNumber: DeviceInfo._getBuildNumber(),
      appInstanceId: DeviceInfo._getAppInstanceId(),
      buildSignature: DeviceInfo._getBuildSignature(),
      appId: DeviceInfo._getAppId(),
      installReferrer: DeviceInfo._getInstallReferrer(),
      installerPackageName: DeviceInfo._getInstallerPackageName(),
      isHeadphonesConnected: DeviceInfo._isHeadphonesConnected(),
      isMouseConnected: DeviceInfo._isMouseConnected(),
      isKeyboardConnected: DeviceInfo._isKeyboardConnected(),
      isTabletMode: DeviceInfo._isTabletMode(),
    };
    
    DeviceInfo._cachedInfo = info;
    
    return { ...info };
  }

  /**
   * Get OS version
   * @returns {string} OS version
   * @private
   */
  static _getOSVersion() {
    if (typeof navigator === 'undefined') {
      return 'unknown';
    }
    
    const userAgent = navigator.userAgent;
    
    if (Platform.OS === 'web') {
      // Extract browser version
      const browserRegex = /(chrome|firefox|safari|edge|opera|trident)\/(\d+(\.\d+)?)/i;
      const match = userAgent.match(browserRegex);
      
      if (match) {
        return match[2];
      }
      
      return 'unknown';
    } else if (Platform.OS === 'android') {
      // Extract Android version
      const match = userAgent.match(/Android (\d+(\.\d+)*)/i);
      return match ? match[1] : 'unknown';
    } else if (Platform.OS === 'ios') {
      // Extract iOS version
      const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/i);
      return match ? `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}` : 'unknown';
    }
    
    return 'unknown';
  }

  /**
   * Check if device is a tablet
   * @param {Object} dimensions - Device dimensions
   * @param {string} userAgent - User agent
   * @returns {boolean} Whether device is a tablet
   * @private
   */
  static _isTablet(dimensions, userAgent) {
    // Check if iPad
    if (/iPad/i.test(userAgent)) {
      return true;
    }
    
    // Check if Android tablet
    if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
      return true;
    }
    
    // Check dimensions
    const { width, height } = dimensions;
    const screenSize = Math.sqrt(width * width + height * height) / 160;
    
    return screenSize >= 7;
  }

  /**
   * Get device brand
   * @param {string} userAgent - User agent
   * @returns {string} Device brand
   * @private
   */
  static _getBrand(userAgent) {
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return 'Apple';
    }
    
    if (/Android/i.test(userAgent)) {
      // Extract brand from user agent
      const brandRegex = /Android.*; ([^;]*)/i;
      const match = userAgent.match(brandRegex);
      
      if (match) {
        const brandModel = match[1].trim();
        const brand = brandModel.split(' ')[0];
        
        return brand;
      }
      
      return 'Android';
    }
    
    if (/Windows/i.test(userAgent)) {
      return 'Microsoft';
    }
    
    if (/Macintosh/i.test(userAgent)) {
      return 'Apple';
    }
    
    if (/Linux/i.test(userAgent)) {
      return 'Linux';
    }
    
    return 'unknown';
  }

  /**
   * Get device model
   * @param {string} userAgent - User agent
   * @returns {string} Device model
   * @private
   */
  static _getModel(userAgent) {
    if (/iPhone/i.test(userAgent)) {
      return 'iPhone';
    }
    
    if (/iPad/i.test(userAgent)) {
      return 'iPad';
    }
    
    if (/iPod/i.test(userAgent)) {
      return 'iPod';
    }
    
    if (/Android/i.test(userAgent)) {
      // Extract model from user agent
      const modelRegex = /Android.*; ([^;]*)/i;
      const match = userAgent.match(modelRegex);
      
      if (match) {
        const brandModel = match[1].trim();
        const modelParts = brandModel.split(' ');
        
        if (modelParts.length > 1) {
          return modelParts.slice(1).join(' ');
        }
      }
      
      return 'Android Device';
    }
    
    return 'unknown';
  }

  /**
   * Get device type
   * @param {Object} dimensions - Device dimensions
   * @param {string} userAgent - User agent
   * @returns {string} Device type
   * @private
   */
  static _getDeviceType(dimensions, userAgent) {
    if (/iPhone|iPod/i.test(userAgent)) {
      return 'phone';
    }
    
    if (/iPad/i.test(userAgent)) {
      return 'tablet';
    }
    
    if (/Android/i.test(userAgent)) {
      if (/Mobile/i.test(userAgent)) {
        return 'phone';
      }
      
      return 'tablet';
    }
    
    if (/Windows Phone/i.test(userAgent)) {
      return 'phone';
    }
    
    if (/Windows|Macintosh|Linux/i.test(userAgent)) {
      return 'desktop';
    }
    
    return 'unknown';
  }

  /**
   * Get device ID
   * @returns {string} Device ID
   * @private
   */
  static _getDeviceId() {
    // This is a mock implementation
    return 'web-device-id';
  }

  /**
   * Get device name
   * @returns {string} Device name
   * @private
   */
  static _getDeviceName() {
    // This is a mock implementation
    return 'Web Browser';
  }

  /**
   * Check if device is an emulator
   * @param {string} userAgent - User agent
   * @returns {boolean} Whether device is an emulator
   * @private
   */
  static _isEmulator(userAgent) {
    // This is a mock implementation
    return false;
  }

  /**
   * Check if device has a notch
   * @param {string} userAgent - User agent
   * @returns {boolean} Whether device has a notch
   * @private
   */
  static _hasNotch(userAgent) {
    // This is a mock implementation
    if (/iPhone/i.test(userAgent)) {
      // iPhone X and newer have notches
      const match = userAgent.match(/iPhone OS (\d+)_/i);
      
      if (match) {
        const majorVersion = parseInt(match[1], 10);
        return majorVersion >= 11;
      }
    }
    
    return false;
  }

  /**
   * Check if device has a system feature
   * @param {string} feature - Feature to check
   * @returns {boolean} Whether device has the feature
   * @private
   */
  static _hasSystemFeature(feature) {
    // This is a mock implementation
    return false;
  }

  /**
   * Get supported ABIs
   * @returns {string[]} Supported ABIs
   * @private
   */
  static _getSupportedAbis() {
    // This is a mock implementation
    return [];
  }

  /**
   * Get supported 32-bit ABIs
   * @returns {string[]} Supported 32-bit ABIs
   * @private
   */
  static _getSupported32BitAbis() {
    // This is a mock implementation
    return [];
  }

  /**
   * Get supported 64-bit ABIs
   * @returns {string[]} Supported 64-bit ABIs
   * @private
   */
  static _getSupported64BitAbis() {
    // This is a mock implementation
    return [];
  }

  /**
   * Check if device has Google Mobile Services
   * @returns {boolean} Whether device has GMS
   * @private
   */
  static _hasGms() {
    // This is a mock implementation
    return false;
  }

  /**
   * Check if device has Huawei Mobile Services
   * @returns {boolean} Whether device has HMS
   * @private
   */
  static _hasHms() {
    // This is a mock implementation
    return false;
  }

  /**
   * Get first install time
   * @returns {number} First install time
   * @private
   */
  static _getFirstInstallTime() {
    // This is a mock implementation
    return 0;
  }

  /**
   * Get last update time
   * @returns {number} Last update time
   * @private
   */
  static _getLastUpdateTime() {
    // This is a mock implementation
    return 0;
  }

  /**
   * Get battery level
   * @returns {number} Battery level
   * @private
   */
  static _getBatteryLevel() {
    // This is a mock implementation
    return 1;
  }

  /**
   * Check if battery is charging
   * @returns {boolean} Whether battery is charging
   * @private
   */
  static _isBatteryCharging() {
    // This is a mock implementation
    return true;
  }

  /**
   * Check if battery is low
   * @returns {boolean} Whether battery is low
   * @private
   */
  static _isLowBattery() {
    // This is a mock implementation
    return false;
  }

  /**
   * Get device locale
   * @returns {string} Device locale
   * @private
   */
  static _getDeviceLocale() {
    if (typeof navigator === 'undefined') {
      return 'en-US';
    }
    
    return navigator.language || 'en-US';
  }

  /**
   * Get device country
   * @returns {string} Device country
   * @private
   */
  static _getDeviceCountry() {
    if (typeof navigator === 'undefined') {
      return 'US';
    }
    
    const locale = navigator.language || 'en-US';
    const parts = locale.split('-');
    
    return parts.length > 1 ? parts[1] : 'US';
  }

  /**
   * Get timezone
   * @returns {string} Timezone
   * @private
   */
  static _getTimezone() {
    if (typeof Intl === 'undefined') {
      return 'UTC';
    }
    
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }

  /**
   * Get carrier
   * @returns {string} Carrier
   * @private
   */
  static _getCarrier() {
    // This is a mock implementation
    return 'unknown';
  }

  /**
   * Get total memory
   * @returns {number} Total memory
   * @private
   */
  static _getTotalMemory() {
    // This is a mock implementation
    return 0;
  }

  /**
   * Get max memory
   * @returns {number} Max memory
   * @private
   */
  static _getMaxMemory() {
    // This is a mock implementation
    return 0;
  }

  /**
   * Get total disk capacity
   * @returns {number} Total disk capacity
   * @private
   */
  static _getTotalDiskCapacity() {
    // This is a mock implementation
    return 0;
  }

  /**
   * Get free disk storage
   * @returns {number} Free disk storage
   * @private
   */
  static _getFreeDiskStorage() {
    // This is a mock implementation
    return 0;
  }

  /**
   * Get battery state
   * @returns {string} Battery state
   * @private
   */
  static _getBatteryState() {
    // This is a mock implementation
    return 'unknown';
  }

  /**
   * Get power state
   * @returns {Object} Power state
   * @private
   */
  static _getPowerState() {
    // This is a mock implementation
    return {
      batteryLevel: 1,
      batteryState: 'unknown',
      lowPowerMode: false,
    };
  }

  /**
   * Check if airplane mode is enabled
   * @returns {boolean} Whether airplane mode is enabled
   * @private
   */
  static _isAirplaneMode() {
    // This is a mock implementation
    return false;
  }

  /**
   * Check if location is enabled
   * @returns {boolean} Whether location is enabled
   * @private
   */
  static _isLocationEnabled() {
    // This is a mock implementation
    return true;
  }

  /**
   * Check if headphones are connected
   * @returns {boolean} Whether headphones are connected
   * @private
   */
  static _isHeadphonesConnected() {
    // This is a mock implementation
    return false;
  }

  /**
   * Get device token
   * @returns {string} Device token
   * @private
   */
  static _getDeviceToken() {
    // This is a mock implementation
    return '';
  }

  /**
   * Get unique ID
   * @returns {string} Unique ID
   * @private
   */
  static _getUniqueId() {
    // This is a mock implementation
    return 'web-unique-id';
  }

  /**
   * Get app name
   * @returns {string} App name
   * @private
   */
  static _getAppName() {
    // This is a mock implementation
    return 'Web App';
  }

  /**
   * Get bundle ID
   * @returns {string} Bundle ID
   * @private
   */
  static _getBundleId() {
    // This is a mock implementation
    return 'com.example.webapp';
  }

  /**
   * Get app version
   * @returns {string} App version
   * @private
   */
  static _getAppVersion() {
    // This is a mock implementation
    return '1.0.0';
  }

  /**
   * Get build number
   * @returns {string} Build number
   * @private
   */
  static _getBuildNumber() {
    // This is a mock implementation
    return '1';
  }

  /**
   * Get app instance ID
   * @returns {string} App instance ID
   * @private
   */
  static _getAppInstanceId() {
    // This is a mock implementation
    return '';
  }

  /**
   * Get build signature
   * @returns {string} Build signature
   * @private
   */
  static _getBuildSignature() {
    // This is a mock implementation
    return '';
  }

  /**
   * Get app ID
   * @returns {string} App ID
   * @private
   */
  static _getAppId() {
    // This is a mock implementation
    return '';
  }

  /**
   * Get install referrer
   * @returns {string} Install referrer
   * @private
   */
  static _getInstallReferrer() {
    // This is a mock implementation
    return '';
  }

  /**
   * Get installer package name
   * @returns {string} Installer package name
   * @private
   */
  static _getInstallerPackageName() {
    // This is a mock implementation
    return '';
  }

  /**
   * Check if mouse is connected
   * @returns {boolean} Whether mouse is connected
   * @private
   */
  static _isMouseConnected() {
    // This is a mock implementation
    return true;
  }

  /**
   * Check if keyboard is connected
   * @returns {boolean} Whether keyboard is connected
   * @private
   */
  static _isKeyboardConnected() {
    // This is a mock implementation
    return true;
  }

  /**
   * Check if device is in tablet mode
   * @returns {boolean} Whether device is in tablet mode
   * @private
   */
  static _isTabletMode() {
    // This is a mock implementation
    return false;
  }
}

export { DeviceInfo };
