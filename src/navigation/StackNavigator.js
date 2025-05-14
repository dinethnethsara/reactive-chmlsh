/**
 * StackNavigator component for Reactive chmlsh
 * A stack-based navigation system similar to React Navigation's Stack Navigator
 */

import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from '../components/View';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Animated } from '../Animated';
import { NavigationContext } from './NavigationContainer';

// Create stack navigation context
export const StackNavigationContext = createContext({
  navigate: () => {},
  goBack: () => {},
  push: () => {},
  pop: () => {},
  popToTop: () => {},
  replace: () => {},
});

/**
 * StackNavigator component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const StackNavigator = (props) => {
  const {
    initialRouteName,
    screenOptions = {},
    children,
    ...otherProps
  } = props;

  // Get screens from children
  const screens = React.Children.toArray(children).filter(
    child => child.type === Screen
  );

  // Find initial route
  const initialRoute = screens.find(
    screen => screen.props.name === initialRouteName
  ) || screens[0];

  if (!initialRoute) {
    console.error('No screens found for StackNavigator');
    return null;
  }

  // Set up navigation state
  const [routes, setRoutes] = useState([
    {
      name: initialRoute.props.name,
      key: `${initialRoute.props.name}-${Date.now()}`,
      params: initialRoute.props.initialParams || {},
    },
  ]);
  
  const [transitioning, setTransitioning] = useState(false);
  const [transitionAnim] = useState(new Animated.Value(0));

  // Get parent navigation context
  const parentNavigation = useContext(NavigationContext);

  // Navigation methods
  const navigate = (name, params) => {
    const existingRouteIndex = routes.findIndex(route => route.name === name);
    
    if (existingRouteIndex !== -1) {
      // Route exists, update params and pop to that route
      setRoutes(prevRoutes => {
        const newRoutes = [...prevRoutes.slice(0, existingRouteIndex + 1)];
        newRoutes[existingRouteIndex] = {
          ...newRoutes[existingRouteIndex],
          params: { ...newRoutes[existingRouteIndex].params, ...params },
        };
        return newRoutes;
      });
    } else {
      // Route doesn't exist, push new route
      push(name, params);
    }
  };

  const push = (name, params) => {
    const screen = screens.find(screen => screen.props.name === name);
    
    if (!screen) {
      console.error(`Screen "${name}" not found`);
      return;
    }
    
    setTransitioning(true);
    
    // Start animation
    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 300,
    }).start(() => {
      setRoutes(prevRoutes => [
        ...prevRoutes,
        {
          name,
          key: `${name}-${Date.now()}`,
          params: { ...screen.props.initialParams, ...params },
        },
      ]);
      
      // Reset animation
      transitionAnim.setValue(0);
      setTransitioning(false);
    });
  };

  const pop = () => {
    if (routes.length <= 1) {
      return;
    }
    
    setTransitioning(true);
    
    // Start animation
    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 300,
    }).start(() => {
      setRoutes(prevRoutes => prevRoutes.slice(0, -1));
      
      // Reset animation
      transitionAnim.setValue(0);
      setTransitioning(false);
    });
  };

  const goBack = () => {
    if (routes.length > 1) {
      pop();
    } else if (parentNavigation) {
      parentNavigation.goBack();
    }
  };

  const popToTop = () => {
    if (routes.length <= 1) {
      return;
    }
    
    setTransitioning(true);
    
    // Start animation
    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 300,
    }).start(() => {
      setRoutes(prevRoutes => [prevRoutes[0]]);
      
      // Reset animation
      transitionAnim.setValue(0);
      setTransitioning(false);
    });
  };

  const replace = (name, params) => {
    const screen = screens.find(screen => screen.props.name === name);
    
    if (!screen) {
      console.error(`Screen "${name}" not found`);
      return;
    }
    
    setRoutes(prevRoutes => {
      const newRoutes = [...prevRoutes];
      newRoutes[newRoutes.length - 1] = {
        name,
        key: `${name}-${Date.now()}`,
        params: { ...screen.props.initialParams, ...params },
      };
      return newRoutes;
    });
  };

  // Create navigation context value
  const navigation = {
    navigate,
    goBack,
    push,
    pop,
    popToTop,
    replace,
    
    // Additional methods
    setParams: (params) => {
      setRoutes(prevRoutes => {
        const newRoutes = [...prevRoutes];
        const currentRoute = newRoutes[newRoutes.length - 1];
        newRoutes[newRoutes.length - 1] = {
          ...currentRoute,
          params: { ...currentRoute.params, ...params },
        };
        return newRoutes;
      });
    },
    
    // Access parent navigation
    getParent: () => parentNavigation,
  };

  // Render current screen
  const currentRoute = routes[routes.length - 1];
  const currentScreen = screens.find(screen => screen.props.name === currentRoute.name);
  
  if (!currentScreen) {
    return null;
  }

  // Get screen component and options
  const { component: ScreenComponent, options } = currentScreen.props;
  
  // Merge options
  const mergedOptions = {
    ...screenOptions,
    ...(typeof options === 'function' ? options({ route: currentRoute, navigation }) : options),
  };

  // Create header
  const renderHeader = () => {
    if (mergedOptions.headerShown === false) {
      return null;
    }
    
    const title = mergedOptions.title || currentRoute.name;
    const headerStyle = mergedOptions.headerStyle || {};
    const headerTintColor = mergedOptions.headerTintColor || '#000000';
    const headerTitleStyle = mergedOptions.headerTitleStyle || {};
    
    return (
      <View style={{
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingHorizontal: 10,
        ...headerStyle,
      }}>
        {routes.length > 1 && (
          <Button
            title="Back"
            onPress={goBack}
            color={headerTintColor}
          />
        )}
        <Text style={{
          flex: 1,
          fontSize: 18,
          fontWeight: 'bold',
          color: headerTintColor,
          textAlign: 'center',
          ...headerTitleStyle,
        }}>
          {title}
        </Text>
      </View>
    );
  };

  return (
    <StackNavigationContext.Provider value={navigation}>
      <View style={{ flex: 1 }} {...otherProps}>
        {renderHeader()}
        <View style={{ flex: 1 }}>
          <ScreenComponent
            route={currentRoute}
            navigation={navigation}
          />
        </View>
      </View>
    </StackNavigationContext.Provider>
  );
};

/**
 * Screen component for defining screens in the navigator
 */
const Screen = () => null;

// Attach Screen component to StackNavigator
StackNavigator.Screen = Screen;

export { StackNavigator };
