/**
 * useRoute hook for Reactive chmlsh
 * A hook to access the route object
 */

import { useContext } from 'react';
import { NavigationContext } from './NavigationContainer';

/**
 * Hook to access the current route object
 * @returns {Object} Route object
 */
export function useRoute() {
  const navigation = useContext(NavigationContext);
  
  // Get current route from navigation
  return navigation.getCurrentRoute() || { params: {} };
}
