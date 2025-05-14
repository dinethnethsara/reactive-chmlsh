/**
 * Memoize utility for Reactive chmlsh
 * A utility for memoizing functions and components
 */

import React, { memo, useMemo, useCallback } from 'react';

/**
 * Memoize a function
 * @param {Function} fn - Function to memoize
 * @param {Function} keyFn - Function to generate cache key
 * @returns {Function} Memoized function
 */
function memoize(fn, keyFn = JSON.stringify) {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = keyFn(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * Memoize a function with a limited cache size
 * @param {Function} fn - Function to memoize
 * @param {Object} options - Memoization options
 * @returns {Function} Memoized function
 */
function memoizeWithLimit(fn, options = {}) {
  const {
    maxSize = 100,
    keyFn = JSON.stringify,
  } = options;
  
  const cache = new Map();
  const keys = [];
  
  return function memoized(...args) {
    const key = keyFn(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    
    // Add to cache
    cache.set(key, result);
    keys.push(key);
    
    // Limit cache size
    if (keys.length > maxSize) {
      const oldestKey = keys.shift();
      cache.delete(oldestKey);
    }
    
    return result;
  };
}

/**
 * Memoize a function with a time-based expiration
 * @param {Function} fn - Function to memoize
 * @param {Object} options - Memoization options
 * @returns {Function} Memoized function
 */
function memoizeWithExpiration(fn, options = {}) {
  const {
    maxAge = 60000, // 1 minute
    keyFn = JSON.stringify,
  } = options;
  
  const cache = new Map();
  
  return function memoized(...args) {
    const key = keyFn(args);
    
    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key);
      
      // Check if value has expired
      if (Date.now() - timestamp < maxAge) {
        return value;
      }
      
      // Remove expired value
      cache.delete(key);
    }
    
    const result = fn.apply(this, args);
    
    // Add to cache
    cache.set(key, {
      value: result,
      timestamp: Date.now(),
    });
    
    return result;
  };
}

/**
 * Memoize a component with custom comparison
 * @param {React.Component} Component - Component to memoize
 * @param {Function} areEqual - Comparison function
 * @returns {React.Component} Memoized component
 */
function memoComponent(Component, areEqual) {
  return memo(Component, areEqual);
}

/**
 * Create a memoized selector
 * @param {Function[]} inputSelectors - Input selector functions
 * @param {Function} resultFn - Result function
 * @param {Function} equalityFn - Equality function
 * @returns {Function} Memoized selector
 */
function createSelector(inputSelectors, resultFn, equalityFn = (a, b) => a === b) {
  let lastInputs = null;
  let lastResult = null;
  
  return function selector(...args) {
    // Get inputs
    const inputs = inputSelectors.map(inputSelector => inputSelector(...args));
    
    // Check if inputs have changed
    if (lastInputs !== null) {
      let inputsEqual = true;
      
      for (let i = 0; i < inputs.length; i++) {
        if (!equalityFn(inputs[i], lastInputs[i])) {
          inputsEqual = false;
          break;
        }
      }
      
      if (inputsEqual) {
        return lastResult;
      }
    }
    
    // Calculate new result
    lastInputs = inputs;
    lastResult = resultFn(...inputs);
    
    return lastResult;
  };
}

/**
 * Create a memoized selector with a cache
 * @param {Function[]} inputSelectors - Input selector functions
 * @param {Function} resultFn - Result function
 * @param {Object} options - Selector options
 * @returns {Function} Memoized selector
 */
function createCachedSelector(inputSelectors, resultFn, options = {}) {
  const {
    keyFn = (...inputs) => inputs.join(','),
    maxSize = 10,
  } = options;
  
  const cache = new Map();
  const keys = [];
  
  return function selector(...args) {
    // Get inputs
    const inputs = inputSelectors.map(inputSelector => inputSelector(...args));
    
    // Generate cache key
    const key = keyFn(...inputs);
    
    // Check cache
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Calculate new result
    const result = resultFn(...inputs);
    
    // Add to cache
    cache.set(key, result);
    keys.push(key);
    
    // Limit cache size
    if (keys.length > maxSize) {
      const oldestKey = keys.shift();
      cache.delete(oldestKey);
    }
    
    return result;
  };
}

/**
 * Hook for memoizing a value
 * @param {any} value - Value to memoize
 * @param {any[]} dependencies - Dependencies
 * @returns {any} Memoized value
 */
function useMemoValue(value, dependencies) {
  return useMemo(() => value, dependencies);
}

/**
 * Hook for memoizing a callback
 * @param {Function} callback - Callback to memoize
 * @param {any[]} dependencies - Dependencies
 * @returns {Function} Memoized callback
 */
function useMemoCallback(callback, dependencies) {
  return useCallback(callback, dependencies);
}

export {
  memoize,
  memoizeWithLimit,
  memoizeWithExpiration,
  memoComponent,
  createSelector,
  createCachedSelector,
  useMemoValue,
  useMemoCallback
};
