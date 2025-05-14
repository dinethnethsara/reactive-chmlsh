/**
 * Comprehensive example app for Reactive chmlsh
 * Showcases all major features of the library including state management, theming, and accessibility
 */

import React, { useState, useEffect } from 'react';
import {
  // Basic components
  View,
  Text,
  Image,
  Button,
  
  // Advanced components
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  
  // Form components
  TextInput,
  Picker,
  Slider,
  Checkbox,
  
  // Utilities
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  AsyncStorage,
  Networking,
  Notifications,
  Gesture,
  useGestureHandler,
  
  // Navigation
  NavigationContainer,
  StackNavigator,
  TabNavigator,
  useNavigation,
  useRoute,
  
  // Hooks
  useWindowDimensions,
  useBackButton,
  useAppState,
  AppStateStatus,
  useColorScheme,
  ColorSchemeName,
  useAccessibility,
  
  // State management
  ChmlshProvider,
  createStore,
  combineReducers,
  applyMiddleware,
  createSelector,
  createAction,
  useStore,
  useDispatch,
  useSelector,
  useAction,
  
  // Theming
  ThemeProvider,
  useTheme,
  useThemedStyles,
  withTheme,
  lightTheme,
  darkTheme,
  
  // Accessibility
  AccessibilityInfo,
  getAccessibilityProps,
  createAccessibilityId,
  createAccessibilityRelationship
} from '../src';

// Define actions
const ADD_TODO = 'todos/ADD_TODO';
const TOGGLE_TODO = 'todos/TOGGLE_TODO';
const SET_FILTER = 'filter/SET_FILTER';

// Define reducers
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: Date.now(),
          text: action.payload,
          completed: false
        }
      ];
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    default:
      return state;
  }
};

const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case SET_FILTER:
      return action.payload;
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  todos: todosReducer,
  filter: filterReducer
});

// Create store
const store = createStore(rootReducer);

// Create selectors
const selectTodos = state => state.todos;
const selectFilter = state => state.filter;
const selectFilteredTodos = createSelector(
  selectTodos,
  selectFilter,
  (todos, filter) => {
    switch (filter) {
      case 'COMPLETED':
        return todos.filter(todo => todo.completed);
      case 'ACTIVE':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }
);

// Create a logger middleware
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

// Home screen component
const HomeScreen = () => {
  const [newTodo, setNewTodo] = useState('');
  const todos = useSelector(selectFilteredTodos);
  const filter = useSelector(selectFilter);
  const addTodo = useAction(ADD_TODO);
  const toggleTodo = useAction(TOGGLE_TODO);
  const setFilter = useAction(SET_FILTER);
  
  // Get theme
  const { theme, toggleTheme } = useTheme();
  
  // Get accessibility info
  const { 
    isScreenReaderEnabled, 
    announce 
  } = useAccessibility();
  
  // Create styles based on theme
  const styles = useThemedStyles(theme => StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    header: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    filterButton: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    filterButtonText: {
      color: theme.colors.text,
    },
    filterButtonTextActive: {
      color: '#FFFFFF',
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
    },
    todoText: {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
    },
    todoTextCompleted: {
      textDecorationLine: 'line-through',
      color: theme.colors.textSecondary,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
    },
    themeToggleText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
    },
    accessibilityInfo: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
    },
    accessibilityText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
    },
  }));
  
  // Handle adding a new todo
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
      
      // Announce for screen readers
      announce(`Added todo: ${newTodo.trim()}`);
    }
  };
  
  // Handle toggling a todo
  const handleToggleTodo = (id, text, completed) => {
    toggleTodo(id);
    
    // Announce for screen readers
    announce(`Marked todo ${text} as ${completed ? 'not completed' : 'completed'}`);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    
    // Announce for screen readers
    announce(`Filter changed to ${newFilter.toLowerCase()}`);
  };
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    toggleTheme();
    
    // Announce for screen readers
    announce(`Theme changed to ${theme === lightTheme ? 'dark' : 'light'} mode`);
  };
  
  // Create accessibility ID for the input
  const inputId = createAccessibilityId('todo-input');
  
  return (
    <View style={styles.container}>
      <Text 
        style={styles.header}
        accessible={true}
        accessibilityRole="header"
      >
        Todo List
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todo"
          placeholderTextColor={theme.colors.placeholder}
          onSubmitEditing={handleAddTodo}
          accessible={true}
          accessibilityLabel="New todo input"
          accessibilityHint="Enter a new todo item"
          id={inputId}
        />
        <Button
          title="Add"
          onPress={handleAddTodo}
          color={theme.colors.primary}
          accessible={true}
          accessibilityLabel="Add todo"
          accessibilityHint="Adds the new todo to the list"
          {...createAccessibilityRelationship('controls', inputId)}
        />
      </View>
      
      <View style={styles.filterContainer}>
        {['ALL', 'ACTIVE', 'COMPLETED'].map(filterType => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive
            ]}
            onPress={() => handleFilterChange(filterType)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${filterType.toLowerCase()} filter`}
            accessibilityState={{ selected: filter === filterType }}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive
              ]}
            >
              {filterType}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.todoItem}
            onPress={() => handleToggleTodo(item.id, item.text, item.completed)}
            accessible={true}
            accessibilityRole="checkbox"
            accessibilityLabel={item.text}
            accessibilityState={{ checked: item.completed }}
            accessibilityHint="Double tap to toggle completion status"
          >
            <Text
              style={[
                styles.todoText,
                item.completed && styles.todoTextCompleted
              ]}
            >
              {item.text}
            </Text>
            <Checkbox
              value={item.completed}
              onValueChange={() => handleToggleTodo(item.id, item.text, item.completed)}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.todoText}>
            No todos found. Add some!
          </Text>
        }
      />
      
      <View style={styles.themeToggle}>
        <Text style={styles.themeToggleText}>
          Dark Mode
        </Text>
        <Switch
          value={theme === darkTheme}
          onValueChange={handleThemeToggle}
          accessible={true}
          accessibilityRole="switch"
          accessibilityLabel="Dark mode toggle"
          accessibilityState={{ checked: theme === darkTheme }}
        />
      </View>
      
      <View style={styles.accessibilityInfo}>
        <Text 
          style={styles.accessibilityText}
          accessible={true}
          accessibilityLiveRegion="polite"
        >
          Screen reader is {isScreenReaderEnabled ? 'enabled' : 'disabled'}
        </Text>
      </View>
    </View>
  );
};

// Main app component
const ComprehensiveApp = () => {
  return (
    <ChmlshProvider store={store}>
      <ThemeProvider useSystemTheme={true}>
        <NavigationContainer>
          <StackNavigator>
            <StackNavigator.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Reactive chmlsh Demo' }}
            />
          </StackNavigator>
        </NavigationContainer>
      </ThemeProvider>
    </ChmlshProvider>
  );
};

export default ComprehensiveApp;
