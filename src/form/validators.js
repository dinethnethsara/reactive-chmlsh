/**
 * Form validators for Reactive chmlsh
 * A collection of common form validation functions
 */

/**
 * Create a required validator
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const required = (message = 'This field is required') => (value) => {
  if (value === undefined || value === null || value === '') {
    return message;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a minimum length validator
 * @param {number} min - Minimum length
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const minLength = (min, message = `Must be at least ${min} characters`) => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  if (String(value).length < min) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a maximum length validator
 * @param {number} max - Maximum length
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const maxLength = (max, message = `Must be at most ${max} characters`) => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  if (String(value).length > max) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a pattern validator
 * @param {RegExp} pattern - Regular expression pattern
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const pattern = (pattern, message = 'Invalid format') => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  if (!pattern.test(String(value))) {
    return message;
  }
  
  return undefined;
};

/**
 * Create an email validator
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const email = (message = 'Invalid email address') => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  
  if (!emailPattern.test(String(value))) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a number validator
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const number = (message = 'Must be a number') => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  if (isNaN(Number(value))) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a minimum value validator
 * @param {number} min - Minimum value
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const min = (min, message = `Must be at least ${min}`) => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  if (Number(value) < min) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a maximum value validator
 * @param {number} max - Maximum value
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const max = (max, message = `Must be at most ${max}`) => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  if (Number(value) > max) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a match validator
 * @param {string} field - Field to match
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const match = (field, message = `Must match ${field}`) => (value, values) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  if (value !== values[field]) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a URL validator
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const url = (message = 'Invalid URL') => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  try {
    new URL(String(value));
    return undefined;
  } catch (error) {
    return message;
  }
};

/**
 * Create a date validator
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const date = (message = 'Invalid date') => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a minimum date validator
 * @param {Date|string} min - Minimum date
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const minDate = (min, message = `Must be after ${min}`) => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  const date = new Date(value);
  const minDate = new Date(min);
  
  if (isNaN(date.getTime()) || isNaN(minDate.getTime())) {
    return 'Invalid date';
  }
  
  if (date < minDate) {
    return message;
  }
  
  return undefined;
};

/**
 * Create a maximum date validator
 * @param {Date|string} max - Maximum date
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export const maxDate = (max, message = `Must be before ${max}`) => (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  const date = new Date(value);
  const maxDate = new Date(max);
  
  if (isNaN(date.getTime()) || isNaN(maxDate.getTime())) {
    return 'Invalid date';
  }
  
  if (date > maxDate) {
    return message;
  }
  
  return undefined;
};

/**
 * Combine multiple validators
 * @param {...Function} validators - Validator functions
 * @returns {Function} Combined validator function
 */
export const compose = (...validators) => (value, values) => {
  for (const validator of validators) {
    const error = validator(value, values);
    
    if (error) {
      return error;
    }
  }
  
  return undefined;
};
