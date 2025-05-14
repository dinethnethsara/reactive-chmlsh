/**
 * NavigationContainer component for Reactive chmlsh
 * A container for navigation state and linking
 */

import React, { createContext, useState, useEffect } from 'react';
import { View } from '../components/View';

// Create navigation context
export const NavigationContext = createContext({
  navigate: () => {},
  goBack: () => {},
  reset: () => {},
  getCurrentRoute: () => {},
  addListener: () => ({ remove: () => {} }),
  getState: () => ({}),
  getParent: () => null,
});

/**
 * NavigationContainer component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const NavigationContainer = (props) => {
  const {
    children,
    initialState,
    onStateChange,
    linking,
    fallback,
    documentTitle,
    theme,
    ...otherProps
  } = props;

  const [isReady, setIsReady] = useState(!linking);
  const [navigationState, setNavigationState] = useState(initialState || {});

  // Initialize navigation state from deep link if provided
  useEffect(() => {
    if (linking) {
      const getInitialState = async () => {
        try {
          // Get current URL
          const url = window.location.href;
          
          // Parse URL using linking configuration
          if (linking.getInitialURL) {
            const initialURL = await linking.getInitialURL();
            
            if (initialURL && linking.getStateFromPath) {
              const state = linking.getStateFromPath(initialURL);
              
              if (state) {
                setNavigationState(state);
              }
            }
          }
          
          setIsReady(true);
        } catch (error) {
          console.error('Error getting initial navigation state:', error);
          setIsReady(true);
        }
      };
      
      getInitialState();
    }
  }, [linking]);

  // Set up URL listener for deep linking
  useEffect(() => {
    if (linking && linking.subscribe && isReady) {
      const subscription = linking.subscribe(({ url }) => {
        if (url && linking.getStateFromPath) {
          const state = linking.getStateFromPath(url);
          
          if (state) {
            setNavigationState(state);
          }
        }
      });
      
      return () => {
        if (subscription && subscription.remove) {
          subscription.remove();
        }
      };
    }
  }, [linking, isReady]);

  // Update document title based on current route
  useEffect(() => {
    if (documentTitle && isReady) {
      const currentRoute = getCurrentRoute();
      
      if (currentRoute && currentRoute.name) {
        document.title = typeof documentTitle === 'function'
          ? documentTitle(currentRoute)
          : `${currentRoute.name} - ${documentTitle}`;
      }
    }
  }, [navigationState, documentTitle, isReady]);

  // Notify state changes
  useEffect(() => {
    if (isReady && onStateChange) {
      onStateChange(navigationState);
    }
  }, [navigationState, onStateChange, isReady]);

  // Navigation methods
  const navigate = (name, params) => {
    setNavigationState((prevState) => {
      // Simple implementation - in a real app, this would be more complex
      return {
        ...prevState,
        routes: [
          ...(prevState.routes || []),
          { name, params, key: `${name}-${Date.now()}` }
        ],
        index: prevState.routes ? prevState.routes.length : 0,
      };
    });
  };

  const goBack = () => {
    setNavigationState((prevState) => {
      if (!prevState.routes || prevState.routes.length <= 1 || prevState.index <= 0) {
        return prevState;
      }
      
      return {
        ...prevState,
        routes: prevState.routes.slice(0, -1),
        index: prevState.index - 1,
      };
    });
  };

  const reset = (state) => {
    setNavigationState(state);
  };

  const getCurrentRoute = () => {
    if (!navigationState.routes || navigationState.routes.length === 0) {
      return null;
    }
    
    return navigationState.routes[navigationState.index || 0];
  };

  const addListener = (type, callback) => {
    // Simple implementation - in a real app, this would use a proper event system
    const listener = () => {};
    
    return {
      remove: () => {},
    };
  };

  const getState = () => navigationState;

  // Create navigation context value
  const contextValue = {
    navigate,
    goBack,
    reset,
    getCurrentRoute,
    addListener,
    getState,
    getParent: () => null,
  };

  // Show fallback while loading
  if (!isReady) {
    return fallback || null;
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      <View style={{ flex: 1 }} {...otherProps}>
        {children}
      </View>
    </NavigationContext.Provider>
  );
};

export { NavigationContainer };
