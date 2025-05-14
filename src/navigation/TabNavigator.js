/**
 * TabNavigator component for Reactive chmlsh
 * A tab-based navigation system similar to React Navigation's Tab Navigator
 */

import React, { useState, useContext } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from '../components/View';
import { Text } from '../components/Text';
import { NavigationContext } from './NavigationContainer';

// Create tab navigation context
export const TabNavigationContext = createContext({
  navigate: () => {},
  jumpTo: () => {},
});

/**
 * TabNavigator component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const TabNavigator = (props) => {
  const {
    initialRouteName,
    screenOptions = {},
    tabBarPosition = 'bottom',
    tabBarStyle,
    tabBarItemStyle,
    tabBarActiveTintColor = '#2196F3',
    tabBarInactiveTintColor = '#757575',
    tabBarLabelStyle,
    tabBarIconStyle,
    tabBarShowLabel = true,
    tabBarShowIcon = true,
    children,
    ...otherProps
  } = props;

  // Get screens from children
  const screens = React.Children.toArray(children).filter(
    child => child.type === Screen
  );

  // Find initial route
  const initialRouteIndex = screens.findIndex(
    screen => screen.props.name === initialRouteName
  );
  
  const [activeIndex, setActiveIndex] = useState(
    initialRouteIndex !== -1 ? initialRouteIndex : 0
  );

  // Get parent navigation context
  const parentNavigation = useContext(NavigationContext);

  // Navigation methods
  const navigate = (name, params) => {
    const index = screens.findIndex(screen => screen.props.name === name);
    
    if (index !== -1) {
      setActiveIndex(index);
    } else if (parentNavigation) {
      parentNavigation.navigate(name, params);
    }
  };

  const jumpTo = (name, params) => {
    navigate(name, params);
  };

  // Create navigation context value
  const navigation = {
    navigate,
    jumpTo,
    
    // Additional methods
    getParent: () => parentNavigation,
  };

  // Get current screen
  const currentScreen = screens[activeIndex];
  
  if (!currentScreen) {
    return null;
  }

  // Get screen component and options
  const { component: ScreenComponent, options, name } = currentScreen.props;
  
  // Create route object
  const route = {
    name,
    key: `${name}-tab`,
    params: currentScreen.props.initialParams || {},
  };

  // Merge options
  const mergedOptions = {
    ...screenOptions,
    ...(typeof options === 'function' ? options({ route, navigation }) : options),
  };

  // Render tab bar
  const renderTabBar = () => {
    const tabBarComponent = (
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#CCCCCC',
        height: 56,
        ...tabBarStyle,
      }}>
        {screens.map((screen, index) => {
          const { name, options } = screen.props;
          
          // Merge options
          const screenOptions = {
            ...screenOptions,
            ...(typeof options === 'function' ? options({ route: { name }, navigation }) : options),
          };
          
          const isActive = index === activeIndex;
          const color = isActive ? tabBarActiveTintColor : tabBarInactiveTintColor;
          
          // Get tab label
          let label = screenOptions.tabBarLabel || name;
          if (typeof label === 'function') {
            label = label({ focused: isActive, color });
          }
          
          // Get tab icon
          let icon = screenOptions.tabBarIcon;
          if (typeof icon === 'function') {
            icon = icon({ focused: isActive, color, size: 24 });
          }
          
          return (
            <View
              key={name}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                ...tabBarItemStyle,
              }}
              onClick={() => setActiveIndex(index)}
            >
              {tabBarShowIcon && icon && (
                <View style={tabBarIconStyle}>
                  {icon}
                </View>
              )}
              {tabBarShowLabel && (
                <Text
                  style={{
                    color,
                    fontSize: 12,
                    ...tabBarLabelStyle,
                  }}
                >
                  {label}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    );
    
    return tabBarPosition === 'top' ? tabBarComponent : null;
  };

  // Render bottom tab bar
  const renderBottomTabBar = () => {
    return tabBarPosition === 'bottom' ? renderTabBar() : null;
  };

  return (
    <TabNavigationContext.Provider value={navigation}>
      <View style={{ flex: 1 }} {...otherProps}>
        {renderTabBar()}
        <View style={{ flex: 1 }}>
          <ScreenComponent
            route={route}
            navigation={navigation}
          />
        </View>
        {renderBottomTabBar()}
      </View>
    </TabNavigationContext.Provider>
  );
};

/**
 * Screen component for defining screens in the navigator
 */
const Screen = () => null;

// Attach Screen component to TabNavigator
TabNavigator.Screen = Screen;

export { TabNavigator };
