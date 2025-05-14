/**
 * Geolocation utility for Reactive chmlsh
 * A geolocation utility similar to React Native's Geolocation
 */

/**
 * Geolocation class for accessing device location
 */
class Geolocation {
  /**
   * Request permission to use geolocation
   * @returns {Promise<boolean>} Whether permission was granted
   */
  static async requestPermission() {
    if (!navigator.geolocation) {
      return false;
    }
    
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { timeout: 10000 }
        );
      });
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current position
   * @param {Object} options - Geolocation options
   * @returns {Promise<Object>} Position object
   */
  static getCurrentPosition(options = {}) {
    if (!navigator.geolocation) {
      return Promise.reject(new Error('Geolocation is not supported'));
    }
    
    const {
      timeout = 10000,
      maximumAge = 10000,
      enableHighAccuracy = false,
    } = options;
    
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude,
              accuracy: position.coords.accuracy,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            },
            timestamp: position.timestamp,
          });
        },
        (error) => {
          let errorMessage;
          
          switch (error.code) {
            case 1:
              errorMessage = 'Permission denied';
              break;
            case 2:
              errorMessage = 'Position unavailable';
              break;
            case 3:
              errorMessage = 'Timeout';
              break;
            default:
              errorMessage = 'Unknown error';
          }
          
          reject(new Error(errorMessage));
        },
        {
          timeout,
          maximumAge,
          enableHighAccuracy,
        }
      );
    });
  }

  /**
   * Watch position changes
   * @param {Function} success - Success callback
   * @param {Function} error - Error callback
   * @param {Object} options - Geolocation options
   * @returns {number} Watch ID
   */
  static watchPosition(success, error, options = {}) {
    if (!navigator.geolocation) {
      error(new Error('Geolocation is not supported'));
      return -1;
    }
    
    const {
      timeout = 10000,
      maximumAge = 10000,
      enableHighAccuracy = false,
      distanceFilter = 100,
    } = options;
    
    let lastPosition = null;
    
    return navigator.geolocation.watchPosition(
      (position) => {
        // Apply distance filter
        if (lastPosition) {
          const distance = this._calculateDistance(
            lastPosition.coords.latitude,
            lastPosition.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
          );
          
          if (distance < distanceFilter) {
            return;
          }
        }
        
        lastPosition = position;
        
        success({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
          },
          timestamp: position.timestamp,
        });
      },
      (err) => {
        let errorMessage;
        
        switch (err.code) {
          case 1:
            errorMessage = 'Permission denied';
            break;
          case 2:
            errorMessage = 'Position unavailable';
            break;
          case 3:
            errorMessage = 'Timeout';
            break;
          default:
            errorMessage = 'Unknown error';
        }
        
        error(new Error(errorMessage));
      },
      {
        timeout,
        maximumAge,
        enableHighAccuracy,
      }
    );
  }

  /**
   * Clear a watch
   * @param {number} watchId - Watch ID to clear
   */
  static clearWatch(watchId) {
    if (navigator.geolocation && watchId !== -1) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {number} Distance in meters
   * @private
   */
  static _calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }
}

export { Geolocation };
