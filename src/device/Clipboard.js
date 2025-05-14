/**
 * Clipboard utility for Reactive chmlsh
 * A utility for accessing the device clipboard
 */

/**
 * Clipboard class
 */
class Clipboard {
  /**
   * Check if clipboard is supported
   * @returns {boolean} Whether clipboard is supported
   */
  static isSupported() {
    return typeof navigator !== 'undefined' && navigator.clipboard;
  }

  /**
   * Get clipboard content
   * @returns {Promise<string>} Clipboard content
   */
  static async getString() {
    if (!Clipboard.isSupported()) {
      throw new Error('Clipboard API is not supported in this environment');
    }
    
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Error reading clipboard:', error);
      throw error;
    }
  }

  /**
   * Set clipboard content
   * @param {string} text - Text to set
   * @returns {Promise<void>}
   */
  static async setString(text) {
    if (!Clipboard.isSupported()) {
      throw new Error('Clipboard API is not supported in this environment');
    }
    
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Error writing to clipboard:', error);
      throw error;
    }
  }

  /**
   * Check if clipboard has content
   * @returns {Promise<boolean>} Whether clipboard has content
   */
  static async hasString() {
    if (!Clipboard.isSupported()) {
      return false;
    }
    
    try {
      const text = await Clipboard.getString();
      return text.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get clipboard content as URL
   * @returns {Promise<string>} Clipboard content as URL
   */
  static async getURL() {
    if (!Clipboard.isSupported()) {
      throw new Error('Clipboard API is not supported in this environment');
    }
    
    try {
      const text = await Clipboard.getString();
      
      // Check if text is a valid URL
      try {
        new URL(text);
        return text;
      } catch (error) {
        throw new Error('Clipboard content is not a valid URL');
      }
    } catch (error) {
      console.error('Error getting URL from clipboard:', error);
      throw error;
    }
  }

  /**
   * Set clipboard content as URL
   * @param {string} url - URL to set
   * @returns {Promise<void>}
   */
  static async setURL(url) {
    if (!Clipboard.isSupported()) {
      throw new Error('Clipboard API is not supported in this environment');
    }
    
    try {
      // Check if URL is valid
      new URL(url);
      
      await Clipboard.setString(url);
    } catch (error) {
      console.error('Error setting URL to clipboard:', error);
      throw error;
    }
  }

  /**
   * Get clipboard content as image
   * @returns {Promise<Blob>} Clipboard content as image
   */
  static async getImage() {
    if (!Clipboard.isSupported() || !navigator.clipboard.read) {
      throw new Error('Clipboard image API is not supported in this environment');
    }
    
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        // Check if clipboard has image
        if (clipboardItem.types.includes('image/png') || 
            clipboardItem.types.includes('image/jpeg') || 
            clipboardItem.types.includes('image/gif')) {
          // Get image type
          const imageType = clipboardItem.types.find(type => type.startsWith('image/'));
          
          // Get image blob
          return await clipboardItem.getType(imageType);
        }
      }
      
      throw new Error('No image found in clipboard');
    } catch (error) {
      console.error('Error getting image from clipboard:', error);
      throw error;
    }
  }

  /**
   * Set clipboard content as image
   * @param {Blob} imageBlob - Image blob to set
   * @returns {Promise<void>}
   */
  static async setImage(imageBlob) {
    if (!Clipboard.isSupported() || !navigator.clipboard.write) {
      throw new Error('Clipboard image API is not supported in this environment');
    }
    
    try {
      // Create clipboard item
      const clipboardItem = new ClipboardItem({
        [imageBlob.type]: imageBlob,
      });
      
      // Write to clipboard
      await navigator.clipboard.write([clipboardItem]);
    } catch (error) {
      console.error('Error setting image to clipboard:', error);
      throw error;
    }
  }

  /**
   * Clear clipboard
   * @returns {Promise<void>}
   */
  static async clear() {
    if (!Clipboard.isSupported()) {
      throw new Error('Clipboard API is not supported in this environment');
    }
    
    try {
      await Clipboard.setString('');
    } catch (error) {
      console.error('Error clearing clipboard:', error);
      throw error;
    }
  }
}

export { Clipboard };
