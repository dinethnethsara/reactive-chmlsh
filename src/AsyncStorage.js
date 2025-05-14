/**
 * AsyncStorage utility for Reactive chmlsh
 * A storage system similar to React Native's AsyncStorage
 */

// Prefix for all keys to avoid conflicts
const KEY_PREFIX = '@ReactiveChmlsh:';

/**
 * AsyncStorage class for storing data
 */
class AsyncStorage {
  /**
   * Get an item from storage
   * @param {string} key - Key to get
   * @returns {Promise<string|null>} Stored value or null if not found
   */
  static async getItem(key) {
    try {
      if (typeof localStorage === 'undefined') {
        return null;
      }
      
      return localStorage.getItem(`${KEY_PREFIX}${key}`);
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  }

  /**
   * Set an item in storage
   * @param {string} key - Key to set
   * @param {string} value - Value to store
   * @returns {Promise<void>}
   */
  static async setItem(key, value) {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      
      return localStorage.setItem(`${KEY_PREFIX}${key}`, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
    }
  }

  /**
   * Remove an item from storage
   * @param {string} key - Key to remove
   * @returns {Promise<void>}
   */
  static async removeItem(key) {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      
      return localStorage.removeItem(`${KEY_PREFIX}${key}`);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
    }
  }

  /**
   * Get all keys in storage
   * @returns {Promise<string[]>} Array of keys
   */
  static async getAllKeys() {
    try {
      if (typeof localStorage === 'undefined') {
        return [];
      }
      
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(KEY_PREFIX)) {
          keys.push(key.substring(KEY_PREFIX.length));
        }
      }
      
      return keys;
    } catch (error) {
      console.error('AsyncStorage getAllKeys error:', error);
      return [];
    }
  }

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  static async clear() {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      
      const keys = await this.getAllKeys();
      for (const key of keys) {
        await this.removeItem(key);
      }
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
    }
  }

  /**
   * Get multiple items from storage
   * @param {string[]} keys - Keys to get
   * @returns {Promise<Array<Array<string|null>>>} Array of [key, value] pairs
   */
  static async multiGet(keys) {
    try {
      if (typeof localStorage === 'undefined') {
        return keys.map(key => [key, null]);
      }
      
      return Promise.all(
        keys.map(async key => {
          const value = await this.getItem(key);
          return [key, value];
        })
      );
    } catch (error) {
      console.error('AsyncStorage multiGet error:', error);
      return keys.map(key => [key, null]);
    }
  }

  /**
   * Set multiple items in storage
   * @param {Array<Array<string>>} keyValuePairs - Array of [key, value] pairs
   * @returns {Promise<void>}
   */
  static async multiSet(keyValuePairs) {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      
      await Promise.all(
        keyValuePairs.map(async ([key, value]) => {
          await this.setItem(key, value);
        })
      );
    } catch (error) {
      console.error('AsyncStorage multiSet error:', error);
    }
  }

  /**
   * Remove multiple items from storage
   * @param {string[]} keys - Keys to remove
   * @returns {Promise<void>}
   */
  static async multiRemove(keys) {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      
      await Promise.all(
        keys.map(async key => {
          await this.removeItem(key);
        })
      );
    } catch (error) {
      console.error('AsyncStorage multiRemove error:', error);
    }
  }

  /**
   * Merge an existing item with a new value
   * @param {string} key - Key to merge
   * @param {string} value - Value to merge
   * @returns {Promise<void>}
   */
  static async mergeItem(key, value) {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      
      const existingValue = await this.getItem(key);
      
      if (existingValue) {
        try {
          const existingObject = JSON.parse(existingValue);
          const valueObject = JSON.parse(value);
          
          const mergedObject = { ...existingObject, ...valueObject };
          await this.setItem(key, JSON.stringify(mergedObject));
        } catch (parseError) {
          // If not JSON, just overwrite
          await this.setItem(key, value);
        }
      } else {
        await this.setItem(key, value);
      }
    } catch (error) {
      console.error('AsyncStorage mergeItem error:', error);
    }
  }
}

export { AsyncStorage };
