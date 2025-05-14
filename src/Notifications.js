/**
 * Notifications utility for Reactive chmlsh
 * A notifications utility for showing system notifications
 */

/**
 * Notifications class for showing system notifications
 */
class Notifications {
  /**
   * Check if notifications are supported
   * @returns {boolean} Whether notifications are supported
   */
  static isSupported() {
    return 'Notification' in window;
  }

  /**
   * Request permission to show notifications
   * @returns {Promise<string>} Permission status ('granted', 'denied', or 'default')
   */
  static async requestPermission() {
    if (!this.isSupported()) {
      return 'denied';
    }
    
    try {
      return await Notification.requestPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Get current permission status
   * @returns {string} Permission status ('granted', 'denied', or 'default')
   */
  static getPermission() {
    if (!this.isSupported()) {
      return 'denied';
    }
    
    return Notification.permission;
  }

  /**
   * Show a notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @returns {Promise<Notification|null>} Notification object or null if not supported
   */
  static async show(title, options = {}) {
    if (!this.isSupported()) {
      return null;
    }
    
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }
    
    try {
      const notification = new Notification(title, {
        body: options.body || '',
        icon: options.icon || '',
        badge: options.badge || '',
        tag: options.tag || '',
        data: options.data || {},
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        ...options,
      });
      
      // Handle notification events
      if (options.onShow) {
        notification.addEventListener('show', options.onShow);
      }
      
      if (options.onClick) {
        notification.addEventListener('click', options.onClick);
      }
      
      if (options.onClose) {
        notification.addEventListener('close', options.onClose);
      }
      
      if (options.onError) {
        notification.addEventListener('error', options.onError);
      }
      
      // Auto close after timeout if specified
      if (options.timeout) {
        setTimeout(() => {
          notification.close();
        }, options.timeout);
      }
      
      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Schedule a notification to show after a delay
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @param {number} delay - Delay in milliseconds
   * @returns {Promise<number>} Timer ID
   */
  static async schedule(title, options = {}, delay = 0) {
    if (!this.isSupported()) {
      return -1;
    }
    
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return -1;
    }
    
    return setTimeout(() => {
      this.show(title, options);
    }, delay);
  }

  /**
   * Cancel a scheduled notification
   * @param {number} id - Timer ID to cancel
   */
  static cancel(id) {
    if (id !== -1) {
      clearTimeout(id);
    }
  }

  /**
   * Create a notification channel (for Android compatibility)
   * @param {string} id - Channel ID
   * @param {string} name - Channel name
   * @param {Object} options - Channel options
   * @returns {Promise<boolean>} Whether the channel was created
   */
  static async createChannel(id, name, options = {}) {
    // This is a no-op on web, but included for API compatibility
    return true;
  }

  /**
   * Delete a notification channel (for Android compatibility)
   * @param {string} id - Channel ID
   * @returns {Promise<boolean>} Whether the channel was deleted
   */
  static async deleteChannel(id) {
    // This is a no-op on web, but included for API compatibility
    return true;
  }
}

export { Notifications };
