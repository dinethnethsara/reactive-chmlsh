/**
 * Networking utility for Reactive chmlsh
 * A networking utility similar to React Native's fetch
 */

/**
 * Networking class for making HTTP requests
 */
class Networking {
  /**
   * Make a fetch request with timeout
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Response>} Fetch response
   */
  static async fetch(url, options = {}, timeout = 30000) {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout}ms`);
      }
      
      throw error;
    }
  }

  /**
   * Make a GET request
   * @param {string} url - URL to fetch
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  static async get(url, options = {}) {
    const { headers = {}, timeout, ...restOptions } = options;
    
    const response = await this.fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers,
      },
      ...restOptions,
    }, timeout);
    
    return this._processResponse(response);
  }

  /**
   * Make a POST request
   * @param {string} url - URL to fetch
   * @param {Object|string} data - Data to send
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  static async post(url, data, options = {}) {
    const { headers = {}, timeout, ...restOptions } = options;
    
    const contentType = headers['Content-Type'] || 'application/json';
    let body = data;
    
    if (contentType.includes('application/json') && typeof data === 'object') {
      body = JSON.stringify(data);
    }
    
    const response = await this.fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': contentType,
        ...headers,
      },
      body,
      ...restOptions,
    }, timeout);
    
    return this._processResponse(response);
  }

  /**
   * Make a PUT request
   * @param {string} url - URL to fetch
   * @param {Object|string} data - Data to send
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  static async put(url, data, options = {}) {
    const { headers = {}, timeout, ...restOptions } = options;
    
    const contentType = headers['Content-Type'] || 'application/json';
    let body = data;
    
    if (contentType.includes('application/json') && typeof data === 'object') {
      body = JSON.stringify(data);
    }
    
    const response = await this.fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': contentType,
        ...headers,
      },
      body,
      ...restOptions,
    }, timeout);
    
    return this._processResponse(response);
  }

  /**
   * Make a DELETE request
   * @param {string} url - URL to fetch
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  static async delete(url, options = {}) {
    const { headers = {}, timeout, ...restOptions } = options;
    
    const response = await this.fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...headers,
      },
      ...restOptions,
    }, timeout);
    
    return this._processResponse(response);
  }

  /**
   * Process response based on content type
   * @param {Response} response - Fetch response
   * @returns {Promise<any>} Processed response data
   * @private
   */
  static async _processResponse(response) {
    if (!response.ok) {
      const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      
      try {
        error.data = await response.json();
      } catch (e) {
        // Ignore JSON parsing errors
      }
      
      throw error;
    }
    
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      return response.json();
    }
    
    if (contentType.includes('text/')) {
      return response.text();
    }
    
    return response.blob();
  }
}

export { Networking };
