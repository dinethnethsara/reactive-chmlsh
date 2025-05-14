/**
 * Form component for Reactive chmlsh
 * A component for rendering forms
 */

import React from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from '../components/View';
import { useForm } from './useForm';

/**
 * Form component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Form = (props) => {
  const {
    children,
    style,
    onSubmit: propOnSubmit,
    ...otherProps
  } = props;

  // Get form state and functions
  const { handleSubmit } = useForm();

  // Handle form submission
  const onSubmit = (event) => {
    event.preventDefault();
    
    if (propOnSubmit) {
      propOnSubmit(event);
    }
    
    handleSubmit(event);
  };

  // Default styles
  const defaultStyles = StyleSheet.create({
    form: {
      width: '100%',
    },
  });

  // Merge styles
  const formStyle = StyleSheet.flatten(defaultStyles.form, style);

  return (
    <form onSubmit={onSubmit} style={formStyle} {...otherProps}>
      {typeof children === 'function'
        ? children({ handleSubmit })
        : children}
    </form>
  );
};

export { Form };
