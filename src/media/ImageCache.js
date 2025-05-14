/**
 * ImageCache utility for Reactive chmlsh
 * A utility for caching images
 */

import { AsyncStorage } from '../AsyncStorage';

/**
 * ImageCache class
 */
class ImageCache {
  static _cache = {};
  static _inProgress = {};
  static _options = {
    maxCacheSize: 50, // Maximum number of images to cache in memory
    ttl: 24 * 60 * 60 * 1000, // Time to live in milliseconds (24 hours)
    persistentStorage: true, // Whether to use persistent storage
    storageKey: '@ReactiveChmlsh:imageCache', // Storage key for persistent cache
  };

  /**
   * Configure cache options
   * @param {Object} options - Cache options
   */
  static configure(options = {}) {
    ImageCache._options = {
      ...ImageCache._options,
      ...options,
    };
  }

  /**
   * Get cache options
   * @returns {Object} Cache options
   */
  static getOptions() {
    return { ...ImageCache._options };
  }

  /**
   * Clear cache
   * @returns {Promise<void>}
   */
  static async clearCache() {
    ImageCache._cache = {};
    
    if (ImageCache._options.persistentStorage) {
      try {
        await AsyncStorage.removeItem(ImageCache._options.storageKey);
      } catch (error) {
        console.error('Error clearing image cache:', error);
      }
    }
  }

  /**
   * Get cache size
   * @returns {number} Cache size
   */
  static getCacheSize() {
    return Object.keys(ImageCache._cache).length;
  }

  /**
   * Get cached image
   * @param {string} uri - Image URI
   * @returns {Promise<string|null>} Cached image data URI or null if not cached
   */
  static async getCachedImage(uri) {
    // Check in-memory cache first
    const cachedImage = ImageCache._cache[uri];
    
    if (cachedImage) {
      // Check if image is expired
      if (cachedImage.timestamp + ImageCache._options.ttl < Date.now()) {
        delete ImageCache._cache[uri];
        return null;
      }
      
      return cachedImage.data;
    }
    
    // Check persistent storage if enabled
    if (ImageCache._options.persistentStorage) {
      try {
        const persistentCache = await AsyncStorage.getItem(ImageCache._options.storageKey);
        
        if (persistentCache) {
          const parsedCache = JSON.parse(persistentCache);
          const persistentImage = parsedCache[uri];
          
          if (persistentImage) {
            // Check if image is expired
            if (persistentImage.timestamp + ImageCache._options.ttl < Date.now()) {
              delete parsedCache[uri];
              await AsyncStorage.setItem(
                ImageCache._options.storageKey,
                JSON.stringify(parsedCache)
              );
              return null;
            }
            
            // Add to in-memory cache
            ImageCache._cache[uri] = persistentImage;
            
            return persistentImage.data;
          }
        }
      } catch (error) {
        console.error('Error getting cached image:', error);
      }
    }
    
    return null;
  }

  /**
   * Cache image
   * @param {string} uri - Image URI
   * @param {string} data - Image data URI
   * @returns {Promise<void>}
   */
  static async cacheImage(uri, data) {
    // Check if cache is full
    if (Object.keys(ImageCache._cache).length >= ImageCache._options.maxCacheSize) {
      // Remove oldest image
      const oldestUri = Object.keys(ImageCache._cache).reduce((oldest, current) => {
        return ImageCache._cache[current].timestamp < ImageCache._cache[oldest].timestamp
          ? current
          : oldest;
      }, Object.keys(ImageCache._cache)[0]);
      
      delete ImageCache._cache[oldestUri];
    }
    
    // Add to in-memory cache
    const timestamp = Date.now();
    ImageCache._cache[uri] = { data, timestamp };
    
    // Add to persistent storage if enabled
    if (ImageCache._options.persistentStorage) {
      try {
        const persistentCache = await AsyncStorage.getItem(ImageCache._options.storageKey);
        const parsedCache = persistentCache ? JSON.parse(persistentCache) : {};
        
        parsedCache[uri] = { data, timestamp };
        
        await AsyncStorage.setItem(
          ImageCache._options.storageKey,
          JSON.stringify(parsedCache)
        );
      } catch (error) {
        console.error('Error caching image:', error);
      }
    }
  }

  /**
   * Prefetch image
   * @param {string} uri - Image URI
   * @returns {Promise<string>} Image data URI
   */
  static async prefetchImage(uri) {
    // Check if already cached
    const cachedImage = await ImageCache.getCachedImage(uri);
    
    if (cachedImage) {
      return cachedImage;
    }
    
    // Check if already in progress
    if (ImageCache._inProgress[uri]) {
      return ImageCache._inProgress[uri];
    }
    
    // Fetch image
    const fetchPromise = new Promise(async (resolve, reject) => {
      try {
        // Fetch image
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Convert to data URI
        const reader = new FileReader();
        
        reader.onload = async () => {
          const dataUri = reader.result;
          
          // Cache image
          await ImageCache.cacheImage(uri, dataUri);
          
          // Remove from in progress
          delete ImageCache._inProgress[uri];
          
          resolve(dataUri);
        };
        
        reader.onerror = (error) => {
          delete ImageCache._inProgress[uri];
          reject(error);
        };
        
        reader.readAsDataURL(blob);
      } catch (error) {
        delete ImageCache._inProgress[uri];
        reject(error);
      }
    });
    
    // Add to in progress
    ImageCache._inProgress[uri] = fetchPromise;
    
    return fetchPromise;
  }

  /**
   * Get image source
   * @param {string} uri - Image URI
   * @returns {Promise<Object>} Image source object
   */
  static async getImageSource(uri) {
    try {
      const dataUri = await ImageCache.prefetchImage(uri);
      return { uri: dataUri };
    } catch (error) {
      console.error('Error getting image source:', error);
      return { uri };
    }
  }
}

export { ImageCache };
