/**
 * Default themes for Reactive chmlsh
 */

/**
 * Light theme
 */
export const lightTheme = {
  // Color palette
  colors: {
    // Primary colors
    primary: '#2196F3',
    primaryDark: '#1976D2',
    primaryLight: '#BBDEFB',
    
    // Secondary colors
    secondary: '#FF4081',
    secondaryDark: '#C2185B',
    secondaryLight: '#F8BBD0',
    
    // Accent colors
    accent: '#FFC107',
    accentDark: '#FFA000',
    accentLight: '#FFECB3',
    
    // Semantic colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Neutral colors
    background: '#FFFFFF',
    surface: '#FFFFFF',
    card: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    textDisabled: '#9E9E9E',
    border: '#E0E0E0',
    divider: '#EEEEEE',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    
    // Status bar
    statusBar: '#1976D2',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System-Medium',
      bold: 'System-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
      xxxl: 42,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Border radius
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 9999,
  },
  
  // Shadows
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 3,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
  },
  
  // Animation
  animation: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  
  // Z-index
  zIndex: {
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

/**
 * Dark theme
 */
export const darkTheme = {
  // Color palette
  colors: {
    // Primary colors
    primary: '#90CAF9',
    primaryDark: '#42A5F5',
    primaryLight: '#E3F2FD',
    
    // Secondary colors
    secondary: '#FF80AB',
    secondaryDark: '#FF4081',
    secondaryLight: '#FCE4EC',
    
    // Accent colors
    accent: '#FFECB3',
    accentDark: '#FFD54F',
    accentLight: '#FFF8E1',
    
    // Semantic colors
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
    info: '#64B5F6',
    
    // Neutral colors
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textDisabled: '#757575',
    border: '#424242',
    divider: '#323232',
    disabled: '#5C5C5C',
    placeholder: '#757575',
    
    // Status bar
    statusBar: '#000000',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Typography (same as light theme)
  typography: lightTheme.typography,
  
  // Spacing (same as light theme)
  spacing: lightTheme.spacing,
  
  // Border radius (same as light theme)
  borderRadius: lightTheme.borderRadius,
  
  // Shadows (adjusted for dark theme)
  shadows: {
    none: lightTheme.shadows.none,
    xs: {
      ...lightTheme.shadows.xs,
      shadowColor: '#000',
      shadowOpacity: 0.3,
    },
    sm: {
      ...lightTheme.shadows.sm,
      shadowColor: '#000',
      shadowOpacity: 0.35,
    },
    md: {
      ...lightTheme.shadows.md,
      shadowColor: '#000',
      shadowOpacity: 0.4,
    },
    lg: {
      ...lightTheme.shadows.lg,
      shadowColor: '#000',
      shadowOpacity: 0.45,
    },
    xl: {
      ...lightTheme.shadows.xl,
      shadowColor: '#000',
      shadowOpacity: 0.5,
    },
  },
  
  // Animation (same as light theme)
  animation: lightTheme.animation,
  
  // Z-index (same as light theme)
  zIndex: lightTheme.zIndex,
};
