/**
 * Base Component class for Reactive chmlsh
 * Extends React.Component with additional functionality
 */

import React from 'react';

class Component extends React.Component {
  /**
   * Constructor for the Component class
   * @param {Object} props - Component properties
   */
  constructor(props) {
    super(props);
    this._chmlshInternalState = {
      mounted: false,
      platform: null
    };
  }

  /**
   * Lifecycle method called when component is mounted
   */
  componentDidMount() {
    this._chmlshInternalState.mounted = true;
    if (this.onMount) {
      this.onMount();
    }
  }

  /**
   * Lifecycle method called when component will unmount
   */
  componentWillUnmount() {
    this._chmlshInternalState.mounted = false;
    if (this.onUnmount) {
      this.onUnmount();
    }
  }

  /**
   * Check if component is mounted
   * @returns {boolean} True if component is mounted
   */
  isMounted() {
    return this._chmlshInternalState.mounted;
  }

  /**
   * Update component with new props
   * @param {Object} newProps - New properties to update
   */
  updateWithProps(newProps) {
    if (this.isMounted()) {
      this.setState((prevState) => ({
        ...prevState,
        ...newProps
      }));
    }
  }
}

export { Component };
