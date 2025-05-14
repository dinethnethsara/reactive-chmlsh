/**
 * PerformanceMonitor utility for Reactive chmlsh
 * A utility for monitoring application performance
 */

/**
 * PerformanceMonitor class
 */
class PerformanceMonitor {
  static _metrics = {
    fps: [],
    memory: [],
    renders: {},
    events: [],
    network: [],
  };
  
  static _isMonitoring = false;
  static _fpsInterval = null;
  static _memoryInterval = null;
  static _networkInterval = null;
  static _lastFrameTime = 0;
  static _frameCount = 0;
  static _maxMetricsLength = 100;
  static _listeners = {};

  /**
   * Start monitoring performance
   * @param {Object} options - Monitoring options
   * @returns {void}
   */
  static startMonitoring(options = {}) {
    const {
      fps = true,
      memory = true,
      renders = true,
      events = true,
      network = true,
      maxMetricsLength = 100,
    } = options;
    
    if (PerformanceMonitor._isMonitoring) {
      return;
    }
    
    PerformanceMonitor._isMonitoring = true;
    PerformanceMonitor._maxMetricsLength = maxMetricsLength;
    
    // Monitor FPS
    if (fps) {
      PerformanceMonitor._startFpsMonitoring();
    }
    
    // Monitor memory
    if (memory) {
      PerformanceMonitor._startMemoryMonitoring();
    }
    
    // Monitor renders
    if (renders) {
      PerformanceMonitor._startRenderMonitoring();
    }
    
    // Monitor events
    if (events) {
      PerformanceMonitor._startEventMonitoring();
    }
    
    // Monitor network
    if (network) {
      PerformanceMonitor._startNetworkMonitoring();
    }
  }

  /**
   * Stop monitoring performance
   * @returns {void}
   */
  static stopMonitoring() {
    if (!PerformanceMonitor._isMonitoring) {
      return;
    }
    
    PerformanceMonitor._isMonitoring = false;
    
    // Stop FPS monitoring
    if (PerformanceMonitor._fpsInterval) {
      cancelAnimationFrame(PerformanceMonitor._fpsInterval);
      PerformanceMonitor._fpsInterval = null;
    }
    
    // Stop memory monitoring
    if (PerformanceMonitor._memoryInterval) {
      clearInterval(PerformanceMonitor._memoryInterval);
      PerformanceMonitor._memoryInterval = null;
    }
    
    // Stop network monitoring
    if (PerformanceMonitor._networkInterval) {
      clearInterval(PerformanceMonitor._networkInterval);
      PerformanceMonitor._networkInterval = null;
    }
    
    // Stop render monitoring
    PerformanceMonitor._stopRenderMonitoring();
    
    // Stop event monitoring
    PerformanceMonitor._stopEventMonitoring();
  }

  /**
   * Get performance metrics
   * @returns {Object} Performance metrics
   */
  static getMetrics() {
    return { ...PerformanceMonitor._metrics };
  }

  /**
   * Clear performance metrics
   * @returns {void}
   */
  static clearMetrics() {
    PerformanceMonitor._metrics = {
      fps: [],
      memory: [],
      renders: {},
      events: [],
      network: [],
    };
  }

  /**
   * Start FPS monitoring
   * @returns {void}
   * @private
   */
  static _startFpsMonitoring() {
    PerformanceMonitor._lastFrameTime = performance.now();
    PerformanceMonitor._frameCount = 0;
    
    const measureFps = () => {
      const now = performance.now();
      PerformanceMonitor._frameCount++;
      
      // Calculate FPS every second
      if (now - PerformanceMonitor._lastFrameTime >= 1000) {
        const fps = Math.round(PerformanceMonitor._frameCount * 1000 / (now - PerformanceMonitor._lastFrameTime));
        
        PerformanceMonitor._metrics.fps.push({
          timestamp: now,
          value: fps,
        });
        
        // Limit metrics length
        if (PerformanceMonitor._metrics.fps.length > PerformanceMonitor._maxMetricsLength) {
          PerformanceMonitor._metrics.fps.shift();
        }
        
        // Notify listeners
        PerformanceMonitor._notifyListeners('fps', {
          timestamp: now,
          value: fps,
        });
        
        PerformanceMonitor._lastFrameTime = now;
        PerformanceMonitor._frameCount = 0;
      }
      
      PerformanceMonitor._fpsInterval = requestAnimationFrame(measureFps);
    };
    
    PerformanceMonitor._fpsInterval = requestAnimationFrame(measureFps);
  }

  /**
   * Start memory monitoring
   * @returns {void}
   * @private
   */
  static _startMemoryMonitoring() {
    // Check if memory API is available
    if (typeof performance === 'undefined' || !performance.memory) {
      console.warn('Memory monitoring is not supported in this environment');
      return;
    }
    
    PerformanceMonitor._memoryInterval = setInterval(() => {
      const now = performance.now();
      const memory = performance.memory;
      
      PerformanceMonitor._metrics.memory.push({
        timestamp: now,
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      });
      
      // Limit metrics length
      if (PerformanceMonitor._metrics.memory.length > PerformanceMonitor._maxMetricsLength) {
        PerformanceMonitor._metrics.memory.shift();
      }
      
      // Notify listeners
      PerformanceMonitor._notifyListeners('memory', {
        timestamp: now,
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      });
    }, 1000);
  }

  /**
   * Start render monitoring
   * @returns {void}
   * @private
   */
  static _startRenderMonitoring() {
    // This is a placeholder for render monitoring
    // In a real implementation, this would hook into React's rendering system
    console.warn('Render monitoring is not implemented yet');
  }

  /**
   * Stop render monitoring
   * @returns {void}
   * @private
   */
  static _stopRenderMonitoring() {
    // This is a placeholder for stopping render monitoring
  }

  /**
   * Start event monitoring
   * @returns {void}
   * @private
   */
  static _startEventMonitoring() {
    // Monitor click events
    document.addEventListener('click', PerformanceMonitor._handleEvent);
    
    // Monitor touch events
    document.addEventListener('touchstart', PerformanceMonitor._handleEvent);
    document.addEventListener('touchend', PerformanceMonitor._handleEvent);
    
    // Monitor scroll events
    document.addEventListener('scroll', PerformanceMonitor._handleEvent);
    
    // Monitor keyboard events
    document.addEventListener('keydown', PerformanceMonitor._handleEvent);
    document.addEventListener('keyup', PerformanceMonitor._handleEvent);
  }

  /**
   * Stop event monitoring
   * @returns {void}
   * @private
   */
  static _stopEventMonitoring() {
    // Remove event listeners
    document.removeEventListener('click', PerformanceMonitor._handleEvent);
    document.removeEventListener('touchstart', PerformanceMonitor._handleEvent);
    document.removeEventListener('touchend', PerformanceMonitor._handleEvent);
    document.removeEventListener('scroll', PerformanceMonitor._handleEvent);
    document.removeEventListener('keydown', PerformanceMonitor._handleEvent);
    document.removeEventListener('keyup', PerformanceMonitor._handleEvent);
  }

  /**
   * Handle DOM event
   * @param {Event} event - DOM event
   * @returns {void}
   * @private
   */
  static _handleEvent(event) {
    const now = performance.now();
    
    PerformanceMonitor._metrics.events.push({
      timestamp: now,
      type: event.type,
      target: event.target.tagName,
    });
    
    // Limit metrics length
    if (PerformanceMonitor._metrics.events.length > PerformanceMonitor._maxMetricsLength) {
      PerformanceMonitor._metrics.events.shift();
    }
    
    // Notify listeners
    PerformanceMonitor._notifyListeners('event', {
      timestamp: now,
      type: event.type,
      target: event.target.tagName,
    });
  }

  /**
   * Start network monitoring
   * @returns {void}
   * @private
   */
  static _startNetworkMonitoring() {
    // Check if Resource Timing API is available
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      console.warn('Network monitoring is not supported in this environment');
      return;
    }
    
    PerformanceMonitor._networkInterval = setInterval(() => {
      const resources = performance.getEntriesByType('resource');
      
      // Process new resources
      for (const resource of resources) {
        PerformanceMonitor._metrics.network.push({
          timestamp: performance.now(),
          name: resource.name,
          initiatorType: resource.initiatorType,
          duration: resource.duration,
          transferSize: resource.transferSize,
          decodedBodySize: resource.decodedBodySize,
        });
      }
      
      // Limit metrics length
      if (PerformanceMonitor._metrics.network.length > PerformanceMonitor._maxMetricsLength) {
        PerformanceMonitor._metrics.network = PerformanceMonitor._metrics.network.slice(-PerformanceMonitor._maxMetricsLength);
      }
      
      // Notify listeners
      PerformanceMonitor._notifyListeners('network', resources);
      
      // Clear resource buffer
      performance.clearResourceTimings();
    }, 5000);
  }

  /**
   * Add performance listener
   * @param {string} type - Metric type
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  static addListener(type, callback) {
    if (!PerformanceMonitor._listeners[type]) {
      PerformanceMonitor._listeners[type] = [];
    }
    
    PerformanceMonitor._listeners[type].push(callback);
    
    return () => {
      PerformanceMonitor._listeners[type] = PerformanceMonitor._listeners[type].filter(cb => cb !== callback);
    };
  }

  /**
   * Notify listeners
   * @param {string} type - Metric type
   * @param {any} data - Metric data
   * @returns {void}
   * @private
   */
  static _notifyListeners(type, data) {
    if (!PerformanceMonitor._listeners[type]) {
      return;
    }
    
    for (const callback of PerformanceMonitor._listeners[type]) {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in performance listener:', error);
      }
    }
  }

  /**
   * Mark a performance event
   * @param {string} name - Event name
   * @returns {void}
   */
  static mark(name) {
    if (typeof performance === 'undefined' || !performance.mark) {
      return;
    }
    
    performance.mark(name);
  }

  /**
   * Measure time between two marks
   * @param {string} name - Measure name
   * @param {string} startMark - Start mark name
   * @param {string} endMark - End mark name
   * @returns {number} Duration in milliseconds
   */
  static measure(name, startMark, endMark) {
    if (typeof performance === 'undefined' || !performance.measure) {
      return 0;
    }
    
    try {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name, 'measure');
      
      if (entries.length > 0) {
        return entries[0].duration;
      }
      
      return 0;
    } catch (error) {
      console.error('Error measuring performance:', error);
      return 0;
    }
  }
}

export { PerformanceMonitor };
