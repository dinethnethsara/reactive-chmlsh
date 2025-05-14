/**
 * Reactive chmlsh
 * A React Native-like library for building cross-platform applications
 *
 * Created by Don PPPredrick College
 * Developed by Dineth Nethsara
 */

import React from 'react';
import { Component } from './Component';

// Basic components
import { View } from './components/View';
import { Text } from './components/Text';
import { Image } from './components/Image';
import { Button } from './components/Button';

// Advanced components
import { ScrollView } from './components/ScrollView';
import { FlatList } from './components/FlatList';
import { Modal } from './components/Modal';
import { ActivityIndicator } from './components/ActivityIndicator';
import { Switch } from './components/Switch';
import { TouchableOpacity } from './components/TouchableOpacity';

// Advanced UI components
import {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  Chip,
  ChipGroup,
  Divider,
  Drawer
} from './components/advanced';

// Form components
import { TextInput } from './components/TextInput';
import { Picker } from './components/Picker';
import { Slider } from './components/Slider';
import { Checkbox } from './components/Checkbox';

// Utilities
import { StyleSheet } from './StyleSheet';
import { Platform } from './Platform';
import { Dimensions } from './Dimensions';
import { Animated } from './Animated';
import { AsyncStorage } from './AsyncStorage';
import { Networking } from './Networking';
import { Geolocation } from './Geolocation';
import { Notifications } from './Notifications';
import { Gesture, useGestureHandler } from './Gesture';

// Navigation
import {
  NavigationContainer,
  StackNavigator,
  TabNavigator,
  useNavigation,
  useRoute
} from './navigation';

// Hooks
import {
  useWindowDimensions,
  useBackButton,
  useAppState,
  AppStateStatus,
  useColorScheme,
  ColorSchemeName,
  useAccessibility
} from './hooks';

// State management
import {
  ChmlshProvider,
  createStore,
  combineReducers,
  applyMiddleware,
  createSelector,
  createAction,
  useStore,
  useDispatch,
  useSelector,
  useAction
} from './state';

// Theming
import {
  ThemeProvider,
  useTheme,
  useThemedStyles,
  withTheme,
  lightTheme,
  darkTheme
} from './theme';

// Accessibility
import {
  AccessibilityInfo,
  getAccessibilityProps,
  createAccessibilityId,
  createAccessibilityRelationship
} from './accessibility';

// Animations
import {
  AnimationPresets,
  Easing,
  FadeIn,
  FadeOut,
  SlideIn,
  ZoomIn,
  Bounce,
  Pulse,
  Shake,
  useAnimation
} from './animations';

// Internationalization
import {
  I18nProvider,
  I18nContext,
  useI18n,
  withI18n,
  I18nText
} from './i18n';

// Form utilities
import {
  FormProvider,
  FormContext,
  useForm,
  useField,
  Form,
  FormField,
  validators
} from './form';

// Media utilities
import {
  ImageCache,
  MediaLibrary,
  Camera,
  Audio
} from './media';

// Security utilities
import {
  Crypto,
  SecureStore,
  Biometrics
} from './security';

// Performance utilities
import {
  PerformanceMonitor,
  Profiler,
  withProfiler,
  useProfiler,
  memoize,
  memoizeWithLimit,
  memoizeWithExpiration,
  memoComponent,
  createSelector as createMemoSelector,
  createCachedSelector,
  useMemoValue,
  useMemoCallback
} from './performance';

// Device utilities
import {
  DeviceInfo,
  Battery,
  Vibration,
  Clipboard
} from './device';

// Export all components and utilities
export {
  // Basic components
  Component,
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

  // Advanced UI components
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  Chip,
  ChipGroup,
  Divider,
  Drawer,

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
  Geolocation,
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
  createAccessibilityRelationship,

  // Animations
  AnimationPresets,
  Easing,
  FadeIn,
  FadeOut,
  SlideIn,
  ZoomIn,
  Bounce,
  Pulse,
  Shake,
  useAnimation,

  // Internationalization
  I18nProvider,
  I18nContext,
  useI18n,
  withI18n,
  I18nText,

  // Form utilities
  FormProvider,
  FormContext,
  useForm,
  useField,
  Form,
  FormField,
  validators,

  // Media utilities
  ImageCache,
  MediaLibrary,
  Camera,
  Audio,

  // Security utilities
  Crypto,
  SecureStore,
  Biometrics,

  // Performance utilities
  PerformanceMonitor,
  Profiler,
  withProfiler,
  useProfiler,
  memoize,
  memoizeWithLimit,
  memoizeWithExpiration,
  memoComponent,
  createMemoSelector,
  createCachedSelector,
  useMemoValue,
  useMemoCallback,

  // Device utilities
  DeviceInfo,
  Battery,
  Vibration,
  Clipboard
};

// Version information
export const VERSION = '0.4.0';

// Library information
export const INFO = {
  name: 'Reactive chmlsh',
  creator: 'Don PPPredrick College',
  developer: 'Dineth Nethsara',
  license: 'MIT'
};

// Default export
export default {
  // Basic components
  Component,
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

  // Advanced UI components
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  Chip,
  ChipGroup,
  Divider,
  Drawer,

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
  Geolocation,
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
  createAccessibilityRelationship,

  // Animations
  AnimationPresets,
  Easing,
  FadeIn,
  FadeOut,
  SlideIn,
  ZoomIn,
  Bounce,
  Pulse,
  Shake,
  useAnimation,

  // Internationalization
  I18nProvider,
  I18nContext,
  useI18n,
  withI18n,
  I18nText,

  // Form utilities
  FormProvider,
  FormContext,
  useForm,
  useField,
  Form,
  FormField,
  validators,

  // Media utilities
  ImageCache,
  MediaLibrary,
  Camera,
  Audio,

  // Security utilities
  Crypto,
  SecureStore,
  Biometrics,

  // Performance utilities
  PerformanceMonitor,
  Profiler,
  withProfiler,
  useProfiler,
  memoize,
  memoizeWithLimit,
  memoizeWithExpiration,
  memoComponent,
  createMemoSelector,
  createCachedSelector,
  useMemoValue,
  useMemoCallback,

  // Device utilities
  DeviceInfo,
  Battery,
  Vibration,
  Clipboard,

  // Version and info
  VERSION,
  INFO
};
