/**
 * useWindowDimensions hook for Reactive chmlsh
 * A hook to get window dimensions
 */

import { useState, useEffect } from 'react';
import { Dimensions } from '../Dimensions';

/**
 * Hook to get window dimensions
 * @returns {Object} Window dimensions object
 */
export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState(Dimensions.get().window);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => subscription.remove();
  }, []);

  return dimensions;
}
