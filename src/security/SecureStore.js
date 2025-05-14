/**
 * SecureStore utility for Reactive chmlsh
 * A utility for securely storing data
 */

import { AsyncStorage } from '../AsyncStorage';
import { Crypto } from './Crypto';

/**
 * SecureStore class
 */
class SecureStore {
  static _masterKey = null;
  static _storageKey = '@ReactiveChmlsh:secureStore';
  static _cache = {};

  /**
   * Initialize secure store
   * @param {Object} options - Initialization options
   * @returns {Promise<void>}
   */
  static async initialize(options = {}) {
    const {
      masterKey,
      storageKey = '@ReactiveChmlsh:secureStore',
    } = options;
    
    SecureStore._storageKey = storageKey;
    
    if (masterKey) {
      SecureStore._masterKey = masterKey;
    } else {
      // Generate a random master key if not provided
      SecureStore._masterKey = Crypto.generateRandomString(32);
    }
    
    // Load cache from storage
    await SecureStore._loadCache();
  }

  /**
   * Load cache from storage
   * @returns {Promise<void>}
   * @private
   */
  static async _loadCache() {
    try {
      const data = await AsyncStorage.getItem(SecureStore._storageKey);
      
      if (data) {
        SecureStore._cache = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading secure store cache:', error);
      SecureStore._cache = {};
    }
  }

  /**
   * Save cache to storage
   * @returns {Promise<void>}
   * @private
   */
  static async _saveCache() {
    try {
      await AsyncStorage.setItem(
        SecureStore._storageKey,
        JSON.stringify(SecureStore._cache)
      );
    } catch (error) {
      console.error('Error saving secure store cache:', error);
    }
  }

  /**
   * Set an item in secure store
   * @param {string} key - Key to set
   * @param {string} value - Value to store
   * @param {Object} options - Storage options
   * @returns {Promise<void>}
   */
  static async setItem(key, value, options = {}) {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    try {
      // Encrypt value
      const encryptedValue = await Crypto.encrypt(value, SecureStore._masterKey);
      
      // Store in cache
      SecureStore._cache[key] = {
        value: encryptedValue,
        options,
        timestamp: Date.now(),
      };
      
      // Save cache to storage
      await SecureStore._saveCache();
    } catch (error) {
      console.error('Error setting secure store item:', error);
      throw error;
    }
  }

  /**
   * Get an item from secure store
   * @param {string} key - Key to get
   * @returns {Promise<string|null>} Stored value or null if not found
   */
  static async getItem(key) {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    try {
      // Get from cache
      const item = SecureStore._cache[key];
      
      if (!item) {
        return null;
      }
      
      // Check if item has expired
      if (item.options.expiresIn) {
        const expirationTime = item.timestamp + item.options.expiresIn;
        
        if (Date.now() > expirationTime) {
          // Item has expired, remove it
          await SecureStore.deleteItem(key);
          return null;
        }
      }
      
      // Decrypt value
      return await Crypto.decrypt(item.value, SecureStore._masterKey);
    } catch (error) {
      console.error('Error getting secure store item:', error);
      return null;
    }
  }

  /**
   * Delete an item from secure store
   * @param {string} key - Key to delete
   * @returns {Promise<void>}
   */
  static async deleteItem(key) {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    try {
      // Remove from cache
      delete SecureStore._cache[key];
      
      // Save cache to storage
      await SecureStore._saveCache();
    } catch (error) {
      console.error('Error deleting secure store item:', error);
      throw error;
    }
  }

  /**
   * Clear all items from secure store
   * @returns {Promise<void>}
   */
  static async clear() {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    try {
      // Clear cache
      SecureStore._cache = {};
      
      // Save cache to storage
      await SecureStore._saveCache();
    } catch (error) {
      console.error('Error clearing secure store:', error);
      throw error;
    }
  }

  /**
   * Get all keys from secure store
   * @returns {Promise<string[]>} Array of keys
   */
  static async getAllKeys() {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    return Object.keys(SecureStore._cache);
  }

  /**
   * Check if secure store contains a key
   * @param {string} key - Key to check
   * @returns {Promise<boolean>} Whether the key exists
   */
  static async containsKey(key) {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    return key in SecureStore._cache;
  }

  /**
   * Get multiple items from secure store
   * @param {string[]} keys - Keys to get
   * @returns {Promise<Object>} Object with key-value pairs
   */
  static async multiGet(keys) {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    const result = {};
    
    await Promise.all(
      keys.map(async (key) => {
        result[key] = await SecureStore.getItem(key);
      })
    );
    
    return result;
  }

  /**
   * Set multiple items in secure store
   * @param {Object} items - Object with key-value pairs
   * @param {Object} options - Storage options
   * @returns {Promise<void>}
   */
  static async multiSet(items, options = {}) {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    await Promise.all(
      Object.entries(items).map(async ([key, value]) => {
        await SecureStore.setItem(key, value, options);
      })
    );
  }

  /**
   * Delete multiple items from secure store
   * @param {string[]} keys - Keys to delete
   * @returns {Promise<void>}
   */
  static async multiDelete(keys) {
    if (!SecureStore._masterKey) {
      throw new Error('SecureStore not initialized');
    }
    
    await Promise.all(
      keys.map(async (key) => {
        await SecureStore.deleteItem(key);
      })
    );
  }
}

export { SecureStore };
