/**
 * Feature Showcase app for Reactive chmlsh
 * Showcases all major features of the library including advanced components, animations,
 * internationalization, form handling, security, performance, and device features
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
  TouchableOpacity,
  
  // Advanced UI components
  Accordion,
  AccordionItem,
  Avatar,
  Badge,
  Card,
  Chip,
  ChipGroup,
  Divider,
  Drawer,
  
  // Utilities
  StyleSheet,
  Platform,
  Dimensions,
  
  // Navigation
  NavigationContainer,
  StackNavigator,
  TabNavigator,
  
  // Hooks
  useWindowDimensions,
  useColorScheme,
  useAccessibility,
  
  // State management
  ChmlshProvider,
  createStore,
  combineReducers,
  useSelector,
  useDispatch,
  
  // Theming
  ThemeProvider,
  useTheme,
  
  // Animations
  FadeIn,
  SlideIn,
  Bounce,
  useAnimation,
  
  // Internationalization
  I18nProvider,
  I18nText,
  useI18n,
  
  // Form utilities
  FormProvider,
  Form,
  FormField,
  validators,
  useForm,
  
  // Media utilities
  ImageCache,
  
  // Security utilities
  Crypto,
  SecureStore,
  
  // Performance utilities
  Profiler,
  memoize,
  
  // Device utilities
  DeviceInfo,
  Battery,
  Vibration,
  Clipboard
} from '../src';

// Define translations
const translations = {
  en: {
    appTitle: 'Feature Showcase',
    home: 'Home',
    profile: 'Profile',
    settings: 'Settings',
    components: 'Components',
    welcome: 'Welcome to Reactive chmlsh!',
    description: 'A comprehensive React Native-like library',
    darkMode: 'Dark Mode',
    language: 'Language',
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    save: 'Save',
    cancel: 'Cancel',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    submit: 'Submit',
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    passwordMismatch: 'Passwords do not match',
    formSuccess: 'Form submitted successfully!',
    deviceInfo: 'Device Info',
    batteryLevel: 'Battery Level',
    platform: 'Platform',
    theme: 'Theme',
    copy: 'Copy',
    paste: 'Paste',
    vibrate: 'Vibrate',
    generatePassword: 'Generate Password',
    advancedComponents: 'Advanced Components',
    animations: 'Animations',
    internationalization: 'Internationalization',
    formValidation: 'Form Validation',
    security: 'Security',
    deviceFeatures: 'Device Features',
  },
  es: {
    appTitle: 'Muestra de Funciones',
    home: 'Inicio',
    profile: 'Perfil',
    settings: 'Configuración',
    components: 'Componentes',
    welcome: '¡Bienvenido a Reactive chmlsh!',
    description: 'Una biblioteca completa similar a React Native',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
    french: 'Francés',
    save: 'Guardar',
    cancel: 'Cancelar',
    name: 'Nombre',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    submit: 'Enviar',
    required: 'Este campo es obligatorio',
    invalidEmail: 'Dirección de correo electrónico inválida',
    passwordMismatch: 'Las contraseñas no coinciden',
    formSuccess: '¡Formulario enviado con éxito!',
    deviceInfo: 'Información del Dispositivo',
    batteryLevel: 'Nivel de Batería',
    platform: 'Plataforma',
    theme: 'Tema',
    copy: 'Copiar',
    paste: 'Pegar',
    vibrate: 'Vibrar',
    generatePassword: 'Generar Contraseña',
    advancedComponents: 'Componentes Avanzados',
    animations: 'Animaciones',
    internationalization: 'Internacionalización',
    formValidation: 'Validación de Formularios',
    security: 'Seguridad',
    deviceFeatures: 'Características del Dispositivo',
  },
  fr: {
    appTitle: 'Vitrine des Fonctionnalités',
    home: 'Accueil',
    profile: 'Profil',
    settings: 'Paramètres',
    components: 'Composants',
    welcome: 'Bienvenue à Reactive chmlsh!',
    description: 'Une bibliothèque complète similaire à React Native',
    darkMode: 'Mode Sombre',
    language: 'Langue',
    english: 'Anglais',
    spanish: 'Espagnol',
    french: 'Français',
    save: 'Enregistrer',
    cancel: 'Annuler',
    name: 'Nom',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    submit: 'Soumettre',
    required: 'Ce champ est obligatoire',
    invalidEmail: 'Adresse email invalide',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    formSuccess: 'Formulaire soumis avec succès!',
    deviceInfo: 'Infos Appareil',
    batteryLevel: 'Niveau de Batterie',
    platform: 'Plateforme',
    theme: 'Thème',
    copy: 'Copier',
    paste: 'Coller',
    vibrate: 'Vibrer',
    generatePassword: 'Générer un Mot de Passe',
    advancedComponents: 'Composants Avancés',
    animations: 'Animations',
    internationalization: 'Internationalisation',
    formValidation: 'Validation de Formulaire',
    security: 'Sécurité',
    deviceFeatures: 'Fonctionnalités de l\'Appareil',
  },
};

// Define reducers
const settingsReducer = (state = { darkMode: false, language: 'en' }, action) => {
  switch (action.type) {
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

const userReducer = (state = { name: '', email: '', isLoggedIn: false }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, ...action.payload, isLoggedIn: true };
    case 'LOGOUT':
      return { name: '', email: '', isLoggedIn: false };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  settings: settingsReducer,
  user: userReducer,
});

// Create store
const store = createStore(rootReducer);

// Home screen component
const HomeScreen = () => {
  const { theme } = useTheme();
  const { t } = useI18n();
  const { announce } = useAccessibility();
  
  // Animation hook
  const welcomeAnimation = useAnimation({
    type: 'spring',
    initialValue: 0,
    toValue: 1,
    autoPlay: true,
  });
  
  // Device info
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  
  // Get device info
  useEffect(() => {
    const info = DeviceInfo.getInfo();
    setDeviceInfo(info);
    
    // Initialize battery
    Battery.initialize().then(() => {
      setBatteryLevel(Battery.getBatteryLevel());
      
      // Add battery listener
      const unsubscribe = Battery.addListener('levelChange', (level) => {
        setBatteryLevel(level);
      });
      
      return () => unsubscribe();
    });
  }, []);
  
  // Handle vibration
  const handleVibrate = () => {
    Vibration.vibrateMedium();
    announce(t('vibrate'));
  };
  
  // Handle clipboard
  const handleCopy = async () => {
    await Clipboard.setString(t('welcome'));
    announce(t('copy'));
  };
  
  const handlePaste = async () => {
    const text = await Clipboard.getString();
    alert(text);
    announce(t('paste'));
  };
  
  // Generate password
  const handleGeneratePassword = () => {
    const password = Crypto.generatePassword({
      length: 12,
      includeSymbols: true,
    });
    
    alert(password);
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FadeIn duration={1000}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('welcome')}
        </Text>
      </FadeIn>
      
      <SlideIn direction="right" duration={800} delay={300}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {t('description')}
        </Text>
      </SlideIn>
      
      <Divider text={t('advancedComponents')} style={{ marginVertical: 20 }} />
      
      <Card style={{ marginBottom: 16 }}>
        <Card.Header
          title="Reactive chmlsh"
          subtitle="v0.4.0"
          left={<Avatar name="Reactive chmlsh" size={40} />}
          right={<Badge value="New" color={theme.colors.primary} />}
        />
        <Card.Content>
          <Text style={{ color: theme.colors.text }}>
            A comprehensive React Native-like library for building cross-platform applications.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button title="Learn More" />
        </Card.Actions>
      </Card>
      
      <Accordion>
        <AccordionItem title={t('animations')}>
          <View style={{ padding: 16 }}>
            <Bounce>
              <Avatar name="Animation" size={60} backgroundColor={theme.colors.primary} />
            </Bounce>
            <Text style={{ marginTop: 8, color: theme.colors.text }}>
              Reactive chmlsh provides powerful animation capabilities.
            </Text>
          </View>
        </AccordionItem>
        
        <AccordionItem title={t('internationalization')}>
          <View style={{ padding: 16 }}>
            <ChipGroup>
              <Chip label={t('english')} selected={true} />
              <Chip label={t('spanish')} />
              <Chip label={t('french')} />
            </ChipGroup>
          </View>
        </AccordionItem>
      </Accordion>
      
      <Divider text={t('deviceFeatures')} style={{ marginVertical: 20 }} />
      
      <View style={styles.infoContainer}>
        <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
          {t('platform')}:
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
          {deviceInfo?.platform} {deviceInfo?.version}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
          {t('batteryLevel')}:
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
          {batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : 'Unknown'}
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title={t('vibrate')} onPress={handleVibrate} />
        <Button title={t('copy')} onPress={handleCopy} />
        <Button title={t('paste')} onPress={handlePaste} />
      </View>
      
      <Button 
        title={t('generatePassword')} 
        onPress={handleGeneratePassword}
        color={theme.colors.secondary}
      />
    </ScrollView>
  );
};

// Profile screen component
const ProfileScreen = () => {
  const { theme } = useTheme();
  const { t } = useI18n();
  const dispatch = useDispatch();
  
  // Form validation
  const validate = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = t('required');
    }
    
    if (!values.email) {
      errors.email = t('required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = t('invalidEmail');
    }
    
    if (!values.password) {
      errors.password = t('required');
    }
    
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = t('passwordMismatch');
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = (values) => {
    // Save user data
    dispatch({
      type: 'SET_USER',
      payload: {
        name: values.name,
        email: values.email,
      },
    });
    
    // Store securely
    SecureStore.initialize().then(() => {
      SecureStore.setItem('user', JSON.stringify({
        name: values.name,
        email: values.email,
      }));
    });
    
    alert(t('formSuccess'));
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FormProvider
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        <Form>
          <FormField
            name="name"
            label={t('name')}
            component={TextInput}
            required
          />
          
          <FormField
            name="email"
            label={t('email')}
            component={TextInput}
            keyboardType="email-address"
            required
          />
          
          <FormField
            name="password"
            label={t('password')}
            component={TextInput}
            secureTextEntry
            required
          />
          
          <FormField
            name="confirmPassword"
            label={t('confirmPassword')}
            component={TextInput}
            secureTextEntry
            required
          />
          
          <Button title={t('submit')} onPress={() => {}} />
        </Form>
      </FormProvider>
    </View>
  );
};

// Settings screen component
const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, setLocale } = useI18n();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  
  // Handle dark mode toggle
  const handleDarkModeToggle = (value) => {
    dispatch({ type: 'SET_DARK_MODE', payload: value });
    toggleTheme();
  };
  
  // Handle language change
  const handleLanguageChange = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    setLocale(language);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
          {t('darkMode')}
        </Text>
        <Switch
          value={settings.darkMode}
          onValueChange={handleDarkModeToggle}
        />
      </View>
      
      <Divider style={{ marginVertical: 16 }} />
      
      <Text style={[styles.settingLabel, { color: theme.colors.text, marginBottom: 8 }]}>
        {t('language')}
      </Text>
      
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            settings.language === 'en' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => handleLanguageChange('en')}
        >
          <Text style={[
            styles.languageText,
            settings.language === 'en' && { color: '#FFFFFF' },
          ]}>
            {t('english')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.languageButton,
            settings.language === 'es' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => handleLanguageChange('es')}
        >
          <Text style={[
            styles.languageText,
            settings.language === 'es' && { color: '#FFFFFF' },
          ]}>
            {t('spanish')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.languageButton,
            settings.language === 'fr' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => handleLanguageChange('fr')}
        >
          <Text style={[
            styles.languageText,
            settings.language === 'fr' && { color: '#FFFFFF' },
          ]}>
            {t('french')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Tab navigator
const TabNav = () => {
  const { theme } = useTheme();
  const { t } = useI18n();
  
  return (
    <TabNavigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <TabNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t('home') }}
      />
      <TabNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('profile') }}
      />
      <TabNavigator.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings') }}
      />
    </TabNavigator>
  );
};

// Main app component
const FeatureShowcase = () => {
  const settings = useSelector(state => state.settings);
  
  return (
    <NavigationContainer>
      <StackNavigator.Screen
        name="Main"
        component={TabNav}
        options={{ title: translations[settings.language].appTitle }}
      />
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoValue: {
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  languageText: {
    fontWeight: '500',
  },
});

// Wrap app with providers
const WrappedApp = () => {
  const [settings, setSettings] = useState({ darkMode: false, language: 'en' });
  
  // Load settings
  useEffect(() => {
    SecureStore.initialize().then(async () => {
      try {
        const savedSettings = await SecureStore.getItem('settings');
        
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          
          // Update store
          store.dispatch({ type: 'SET_DARK_MODE', payload: parsedSettings.darkMode });
          store.dispatch({ type: 'SET_LANGUAGE', payload: parsedSettings.language });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    });
  }, []);
  
  // Save settings when they change
  useEffect(() => {
    SecureStore.initialize().then(async () => {
      try {
        await SecureStore.setItem('settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    });
  }, [settings]);
  
  // Listen for store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      setSettings(state.settings);
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
    <ChmlshProvider store={store}>
      <ThemeProvider useSystemTheme={false} initialTheme={settings.darkMode ? darkTheme : lightTheme}>
        <I18nProvider defaultLocale={settings.language} translations={translations}>
          <FeatureShowcase />
        </I18nProvider>
      </ThemeProvider>
    </ChmlshProvider>
  );
};

export default WrappedApp;
