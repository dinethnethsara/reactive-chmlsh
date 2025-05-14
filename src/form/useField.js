/**
 * useField hook for Reactive chmlsh
 * A hook for managing a single form field
 */

import { useCallback } from 'react';
import { useForm } from './useForm';

/**
 * Hook for managing a single form field
 * @param {string} name - Field name
 * @returns {Object} Field state and functions
 */
const useField = (name) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
  } = useForm();

  // Get field value
  const value = values[name];
  
  // Get field error
  const error = errors[name];
  
  // Get field touched state
  const isTouched = !!touched[name];
  
  // Handle field change
  const handleChange = useCallback((event) => {
    const newValue = event && event.target
      ? event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value
      : event;
    
    setFieldValue(name, newValue);
  }, [name, setFieldValue]);
  
  // Handle field blur
  const handleBlur = useCallback(() => {
    setFieldTouched(name, true);
  }, [name, setFieldTouched]);
  
  // Get field props
  const getFieldProps = useCallback(() => ({
    name,
    value: value === undefined ? '' : value,
    onChange: handleChange,
    onBlur: handleBlur,
  }), [name, value, handleChange, handleBlur]);
  
  // Get input props
  const getInputProps = useCallback((props = {}) => ({
    ...getFieldProps(),
    ...props,
  }), [getFieldProps]);
  
  // Get meta information
  const meta = {
    value,
    error,
    touched: isTouched,
    initialValue: values[name],
  };
  
  // Validate field
  const validate = useCallback(() => {
    return validateField(name);
  }, [name, validateField]);
  
  // Set field value directly
  const setValue = useCallback((newValue) => {
    setFieldValue(name, newValue);
  }, [name, setFieldValue]);
  
  // Set field error directly
  const setError = useCallback((newError) => {
    setFieldError(name, newError);
  }, [name, setFieldError]);
  
  // Set field touched state directly
  const setTouched = useCallback((isTouched = true) => {
    setFieldTouched(name, isTouched);
  }, [name, setFieldTouched]);

  return {
    field: {
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
    meta,
    helpers: {
      setValue,
      setError,
      setTouched,
      validate,
    },
    getFieldProps,
    getInputProps,
  };
};

export { useField };
