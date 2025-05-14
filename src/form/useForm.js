/**
 * useForm hook for Reactive chmlsh
 * A hook for accessing form state and validation
 */

import { useContext } from 'react';
import { FormContext } from './FormProvider';

/**
 * Hook for accessing form state and validation
 * @returns {Object} Form state and functions
 */
const useForm = () => {
  const context = useContext(FormContext);
  
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  
  return context;
};

export { useForm };
