/**
 * Crypto utility for Reactive chmlsh
 * A utility for cryptographic operations
 */

/**
 * Crypto class
 */
class Crypto {
  /**
   * Generate a random string
   * @param {number} length - Length of the string
   * @param {string} charset - Character set to use
   * @returns {string} Random string
   */
  static generateRandomString(length = 16, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    const charsetLength = charset.length;
    
    // Use crypto.getRandomValues if available
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const values = new Uint32Array(length);
      crypto.getRandomValues(values);
      
      for (let i = 0; i < length; i++) {
        result += charset[values[i] % charsetLength];
      }
    } else {
      // Fallback to Math.random
      for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charsetLength));
      }
    }
    
    return result;
  }

  /**
   * Generate a UUID v4
   * @returns {string} UUID
   */
  static generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Hash a string using SHA-256
   * @param {string} data - Data to hash
   * @returns {Promise<string>} Hashed data
   */
  static async hashString(data) {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API is not supported in this environment');
    }
    
    try {
      // Convert string to buffer
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Hash data
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      
      // Convert buffer to hex string
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('Error hashing string:', error);
      throw error;
    }
  }

  /**
   * Encrypt data
   * @param {string} data - Data to encrypt
   * @param {string} password - Password to use
   * @returns {Promise<string>} Encrypted data
   */
  static async encrypt(data, password) {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API is not supported in this environment');
    }
    
    try {
      // Convert string to buffer
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Generate salt
      const salt = crypto.getRandomValues(new Uint8Array(16));
      
      // Derive key from password
      const passwordBuffer = encoder.encode(password);
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
      
      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt data
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        dataBuffer
      );
      
      // Combine salt, IV, and encrypted data
      const result = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
      result.set(salt, 0);
      result.set(iv, salt.length);
      result.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
      
      // Convert to base64
      return btoa(String.fromCharCode.apply(null, result));
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw error;
    }
  }

  /**
   * Decrypt data
   * @param {string} encryptedData - Data to decrypt
   * @param {string} password - Password to use
   * @returns {Promise<string>} Decrypted data
   */
  static async decrypt(encryptedData, password) {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API is not supported in this environment');
    }
    
    try {
      // Convert base64 to buffer
      const encryptedBuffer = new Uint8Array(
        atob(encryptedData).split('').map(c => c.charCodeAt(0))
      );
      
      // Extract salt, IV, and encrypted data
      const salt = encryptedBuffer.slice(0, 16);
      const iv = encryptedBuffer.slice(16, 28);
      const data = encryptedBuffer.slice(28);
      
      // Derive key from password
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
      
      // Decrypt data
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        data
      );
      
      // Convert buffer to string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw error;
    }
  }

  /**
   * Generate a secure password
   * @param {Object} options - Password options
   * @returns {string} Password
   */
  static generatePassword(options = {}) {
    const {
      length = 16,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
    } = options;
    
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    return Crypto.generateRandomString(length, charset);
  }

  /**
   * Compare two strings in constant time
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {boolean} Whether the strings are equal
   */
  static constantTimeEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
}

export { Crypto };
