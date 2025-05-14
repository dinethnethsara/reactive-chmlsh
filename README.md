# Reactive chmlsh

A powerful React Native-like library for building cross-platform applications with comprehensive features including state management, theming, accessibility, internationalization, security, and performance optimization.

Created by Don PPPredrick College
Developed by Dineth Nethsara

## Overview

Reactive chmlsh is a comprehensive JavaScript library that provides React Native-like components and APIs for building cross-platform applications. It allows you to use a single codebase to create applications that work on web, mobile, and desktop platforms with a rich set of features and utilities including state management, theming, accessibility, animations, internationalization, form handling, media management, security, performance optimization, and device features.

## Installation

```bash
npm install reactive-chmlsh
```

## Usage

```jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  useColorScheme,
  ColorSchemeName
} from 'reactive-chmlsh';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === ColorSchemeName.DARK;

  return (
    <ScrollView>
      <View style={[
        styles.container,
        isDarkMode && styles.darkContainer
      ]}>
        <Text style={[
          styles.title,
          isDarkMode && styles.darkText
        ]}>
          Hello, Reactive chmlsh!
        </Text>

        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter some text"
        />

        <View style={styles.row}>
          <Text style={isDarkMode && styles.darkText}>
            Enable notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        <Button
          title="Press Me"
          onPress={() => alert(`Text: ${inputText}, Notifications: ${notificationsEnabled}`)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
});

export default App;
```

## Components

### Basic Components

- **View**: A container component for other components
- **Text**: A component for displaying text
- **Image**: A component for displaying images
- **Button**: A component for handling user interactions

### Advanced Components

- **ScrollView**: A scrollable container component
- **FlatList**: An efficient list component for rendering large lists
- **Modal**: A component for displaying modal dialogs
- **ActivityIndicator**: A loading indicator component
- **Switch**: A toggle switch component
- **TouchableOpacity**: A wrapper component that provides opacity feedback on touch

### Advanced UI Components

- **Accordion**: A collapsible content panel component
- **Avatar**: A component for displaying user avatars
- **Badge**: A small status descriptor for UI elements
- **Card**: A container with a shadow and rounded corners
- **Chip**: A compact element that represents an input, attribute, or action
- **Divider**: A thin line that groups content in lists and layouts
- **Drawer**: A panel that slides in from the edge of the screen

### Form Components

- **TextInput**: A component for text input
- **Picker**: A dropdown selection component
- **Slider**: A slider component for selecting values from a range
- **Checkbox**: A checkbox component for boolean input

## Navigation

Reactive chmlsh provides a powerful navigation system:

- **NavigationContainer**: A container for navigation state
- **StackNavigator**: A stack-based navigation system
- **TabNavigator**: A tab-based navigation system
- **useNavigation**: A hook to access the navigation object
- **useRoute**: A hook to access the current route

```jsx
import React from 'react';
import {
  NavigationContainer,
  StackNavigator,
  View,
  Text,
  Button
} from 'reactive-chmlsh';

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
    <Button
      title="Go to Details"
      onPress={() => navigation.navigate('Details', { id: 123 })}
    />
  </View>
);

const DetailsScreen = ({ route }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
    <Text>Item ID: {route.params.id}</Text>
  </View>
);

const App = () => (
  <NavigationContainer>
    <StackNavigator initialRouteName="Home">
      <StackNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <StackNavigator.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Details' }}
      />
    </StackNavigator>
  </NavigationContainer>
);

export default App;
```

## Hooks

Reactive chmlsh provides several custom hooks:

- **useWindowDimensions**: A hook to get window dimensions
- **useBackButton**: A hook to handle back button presses
- **useAppState**: A hook to track app state (active, background, inactive)
- **useColorScheme**: A hook to get the user's preferred color scheme (light or dark)
- **useAccessibility**: A hook to access accessibility features
- **useTheme**: A hook to access the current theme
- **useThemedStyles**: A hook to get themed styles
- **useStore**: A hook to access the store state
- **useDispatch**: A hook to access the store dispatch function
- **useSelector**: A hook to select data from the store
- **useAction**: A hook to create and dispatch an action
- **useAnimation**: A hook for creating and controlling animations
- **useI18n**: A hook for accessing internationalization functions
- **useForm**: A hook for accessing form state and validation
- **useField**: A hook for managing a single form field
- **useProfiler**: A hook for profiling component performance

## Utilities

### Core Utilities

- **StyleSheet**: A utility for creating and managing styles
- **Platform**: A utility for platform-specific code
- **Dimensions**: A utility for responsive design
- **Animated**: A utility for creating animations

### Advanced Utilities

- **AsyncStorage**: A storage system for persisting data
- **Networking**: A utility for making HTTP requests
- **Geolocation**: A utility for accessing device location
- **Notifications**: A utility for showing system notifications
- **Gesture**: A utility for handling touch and mouse gestures

### Animation Utilities

- **AnimationPresets**: Predefined animation configurations for common use cases
- **Easing**: Easing functions for animations
- **FadeIn**: A component for fade-in animations
- **FadeOut**: A component for fade-out animations
- **SlideIn**: A component for slide-in animations
- **ZoomIn**: A component for zoom-in animations
- **Bounce**: A component for bounce animations
- **Pulse**: A component for pulse animations
- **Shake**: A component for shake animations

### Internationalization Utilities

- **I18nProvider**: A provider for internationalization
- **I18nText**: A component for displaying translated text
- **withI18n**: A higher-order component for injecting internationalization functions

### Form Utilities

- **FormProvider**: A provider for form state and validation
- **Form**: A component for rendering forms
- **FormField**: A component for rendering form fields with validation
- **validators**: A collection of common form validation functions

### Media Utilities

- **ImageCache**: A utility for caching images
- **MediaLibrary**: A utility for accessing device media library
- **Camera**: A utility for accessing device camera
- **Audio**: A utility for playing and recording audio

### Security Utilities

- **Crypto**: A utility for cryptographic operations
- **SecureStore**: A utility for securely storing data
- **Biometrics**: A utility for biometric authentication

### Performance Utilities

- **PerformanceMonitor**: A utility for monitoring application performance
- **Profiler**: A component for profiling React component performance
- **withProfiler**: A higher-order component for profiling
- **memoize**: A utility for memoizing functions
- **memoizeWithLimit**: A utility for memoizing functions with a limited cache size
- **memoizeWithExpiration**: A utility for memoizing functions with a time-based expiration
- **memoComponent**: A utility for memoizing components with custom comparison

### Device Utilities

- **DeviceInfo**: A utility for getting device information
- **Battery**: A utility for accessing device battery information
- **Vibration**: A utility for controlling device vibration
- **Clipboard**: A utility for accessing the device clipboard

## State Management

Reactive chmlsh provides a lightweight Redux-like state management system:

- **ChmlshProvider**: A provider component for the store
- **createStore**: A function to create a store
- **combineReducers**: A function to combine multiple reducers
- **applyMiddleware**: A function to apply middleware
- **createSelector**: A function to create a memoized selector
- **createAction**: A function to create an action creator

```jsx
import React from 'react';
import {
  ChmlshProvider,
  createStore,
  createAction,
  useSelector,
  useAction
} from 'reactive-chmlsh';

// Define actions
const INCREMENT = 'counter/INCREMENT';
const DECREMENT = 'counter/DECREMENT';

// Define reducer
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

// Create store
const store = createStore(counterReducer);

// Counter component
const Counter = () => {
  const count = useSelector(state => state.count);
  const increment = useAction(INCREMENT);
  const decrement = useAction(DECREMENT);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={increment} />
      <Button title="Decrement" onPress={decrement} />
    </View>
  );
};

// App component
const App = () => (
  <ChmlshProvider store={store}>
    <Counter />
  </ChmlshProvider>
);
```

## Theming

Reactive chmlsh provides a theming system for consistent styling:

- **ThemeProvider**: A provider component for the theme
- **useTheme**: A hook to access the current theme
- **useThemedStyles**: A hook to get themed styles
- **withTheme**: A higher-order component to inject theme into a component
- **lightTheme**: A default light theme
- **darkTheme**: A default dark theme

```jsx
import React from 'react';
import {
  ThemeProvider,
  useTheme,
  useThemedStyles,
  StyleSheet,
  View,
  Text,
  Button
} from 'reactive-chmlsh';

// Component with themed styles
const ThemedComponent = () => {
  const { theme, toggleTheme } = useTheme();

  const styles = useThemedStyles(theme => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    text: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
    },
    button: {
      backgroundColor: theme.colors.primary,
    }
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Current theme: {theme.isDark ? 'Dark' : 'Light'}
      </Text>
      <Button
        title="Toggle Theme"
        onPress={toggleTheme}
        style={styles.button}
      />
    </View>
  );
};

// App with theme provider
const App = () => (
  <ThemeProvider useSystemTheme={true}>
    <ThemedComponent />
  </ThemeProvider>
);
```

## Accessibility

Reactive chmlsh provides accessibility features to make applications more inclusive:

- **AccessibilityInfo**: A utility for accessing accessibility information
- **getAccessibilityProps**: A utility for converting React Native accessibility props to ARIA attributes
- **createAccessibilityId**: A utility for creating unique accessibility IDs
- **createAccessibilityRelationship**: A utility for creating accessibility relationships

```jsx
import React from 'react';
import {
  View,
  Text,
  Button,
  AccessibilityInfo,
  useAccessibility
} from 'reactive-chmlsh';

const AccessibleComponent = () => {
  const {
    isScreenReaderEnabled,
    announce
  } = useAccessibility();

  const handlePress = () => {
    // Announce a message to screen readers
    announce('Button pressed', 'assertive');
  };

  return (
    <View>
      <Text>
        Screen reader is {isScreenReaderEnabled ? 'enabled' : 'disabled'}
      </Text>
      <Button
        title="Announce"
        onPress={handlePress}
        accessible={true}
        accessibilityLabel="Announce button"
        accessibilityHint="Announces a message when pressed"
        accessibilityRole="button"
      />
    </View>
  );
};
```

## Platform Support

Reactive chmlsh supports the following platforms:

- Web (browsers)
- Android (via React Native)
- iOS (via React Native)
- Windows (via React Native for Windows)
- macOS (via React Native for macOS)
- Linux (via React Native for Linux)

## Examples

Check out the `examples` directory for more usage examples:

- Simple counter app
- Form handling
- Navigation
- Animations
- Gestures
- Storage and networking
- State management
- Theming
- Accessibility features
- Internationalization
- Media handling
- Security features
- Performance optimization
- Device features

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

Reactive chmlsh is inspired by React Native and aims to provide a similar API for cross-platform development with enhanced features and capabilities.
