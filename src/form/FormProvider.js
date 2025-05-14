/**
 * FormProvider for Reactive chmlsh
 * A provider for form state and validation
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';

// Create context
const FormContext = createContext({
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true,
  setFieldValue: () => {},
  setFieldError: () => {},
  setFieldTouched: () => {},
  setValues: () => {},
  setErrors: () => {},
  setTouched: () => {},
  resetForm: () => {},
  handleSubmit: () => {},
  validateForm: () => {},
  validateField: () => {},
});

/**
 * FormProvider component
 * @param {Object} props - Component properties
 * @returns {React.Element} Provider component
 */
const FormProvider = (props) => {
  const {
    children,
    initialValues = {},
    initialErrors = {},
    initialTouched = {},
    onSubmit,
    validate,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnMount = false,
  } = props;

  // Form state
  const [values, setValuesState] = useState(initialValues);
  const [errors, setErrorsState] = useState(initialErrors);
  const [touched, setTouchedState] = useState(initialTouched);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(Object.keys(initialErrors).length === 0);

  // Validate form
  const validateForm = useCallback(async () => {
    if (!validate) {
      return {};
    }
    
    try {
      const validationErrors = await validate(values);
      setErrorsState(validationErrors || {});
      setIsValid(Object.keys(validationErrors || {}).length === 0);
      return validationErrors || {};
    } catch (error) {
      console.error('Form validation error:', error);
      return {};
    }
  }, [values, validate]);

  // Validate field
  const validateField = useCallback(async (name) => {
    if (!validate) {
      return;
    }
    
    try {
      const validationErrors = await validate(values);
      const fieldError = validationErrors?.[name];
      
      setErrorsState(prevErrors => ({
        ...prevErrors,
        [name]: fieldError,
      }));
      
      return fieldError;
    } catch (error) {
      console.error(`Field validation error for ${name}:`, error);
      return undefined;
    }
  }, [values, validate]);

  // Set field value
  const setFieldValue = useCallback((name, value) => {
    setValuesState(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    
    if (validateOnChange) {
      validateField(name);
    }
  }, [validateOnChange, validateField]);

  // Set field error
  const setFieldError = useCallback((name, error) => {
    setErrorsState(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
    
    setIsValid(prevIsValid => {
      if (error) {
        return false;
      }
      
      const newErrors = {
        ...errors,
        [name]: error,
      };
      
      return Object.values(newErrors).every(err => !err);
    });
  }, [errors]);

  // Set field touched
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouchedState(prevTouched => ({
      ...prevTouched,
      [name]: isTouched,
    }));
    
    if (validateOnBlur) {
      validateField(name);
    }
  }, [validateOnBlur, validateField]);

  // Set values
  const setValues = useCallback((newValues) => {
    setValuesState(prevValues => ({
      ...prevValues,
      ...newValues,
    }));
    
    if (validateOnChange) {
      validateForm();
    }
  }, [validateOnChange, validateForm]);

  // Set errors
  const setErrors = useCallback((newErrors) => {
    setErrorsState(prevErrors => ({
      ...prevErrors,
      ...newErrors,
    }));
    
    setIsValid(Object.values(newErrors).every(error => !error));
  }, []);

  // Set touched
  const setTouched = useCallback((newTouched) => {
    setTouchedState(prevTouched => ({
      ...prevTouched,
      ...newTouched,
    }));
    
    if (validateOnBlur) {
      validateForm();
    }
  }, [validateOnBlur, validateForm]);

  // Reset form
  const resetForm = useCallback((newState) => {
    setValuesState(newState?.values || initialValues);
    setErrorsState(newState?.errors || initialErrors);
    setTouchedState(newState?.touched || initialTouched);
    setIsSubmitting(false);
    setIsValid(Object.keys(newState?.errors || initialErrors).length === 0);
  }, [initialValues, initialErrors, initialTouched]);

  // Handle form submission
  const handleSubmit = useCallback(async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    
    setIsSubmitting(true);
    
    // Validate form
    const validationErrors = await validateForm();
    const isFormValid = Object.keys(validationErrors).length === 0;
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouchedState(allTouched);
    
    // If form is valid, call onSubmit
    if (isFormValid && onSubmit) {
      try {
        await onSubmit(values, {
          setValues,
          setErrors,
          setTouched,
          resetForm,
        });
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [values, validateForm, onSubmit, setValues, setErrors, setTouched, resetForm]);

  // Validate form on mount
  useEffect(() => {
    if (validateOnMount) {
      validateForm();
    }
  }, [validateOnMount, validateForm]);

  // Context value
  const contextValue = {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    setErrors,
    setTouched,
    resetForm,
    handleSubmit,
    validateForm,
    validateField,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export { FormProvider, FormContext };
