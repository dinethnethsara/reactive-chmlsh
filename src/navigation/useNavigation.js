/**
 * useNavigation hook for Reactive chmlsh
 * A hook to access the navigation object
 */

import { useContext } from 'react';
import { NavigationContext } from './NavigationContainer';
import { StackNavigationContext } from './StackNavigator';
import { TabNavigationContext } from './TabNavigator';

/**
 * Hook to access the navigation object
 * @returns {Object} Navigation object
 */
export function useNavigation() {
  // Try to get navigation from different contexts
  const stackNavigation = useContext(StackNavigationContext);
  const tabNavigation = useContext(TabNavigationContext);
  const navigation = useContext(NavigationContext);
  
  // Return the most specific navigation context available
  return stackNavigation || tabNavigation || navigation;
}
