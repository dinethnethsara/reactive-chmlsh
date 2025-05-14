/**
 * Advanced example app for Reactive chmlsh
 * Showcases multiple features of the library
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TextInput,
  Switch,
  Slider,
  Checkbox,
  FlatList,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  AsyncStorage,
  Networking,
  Notifications,
  Gesture,
  useGestureHandler,
  useColorScheme,
  ColorSchemeName,
  useWindowDimensions,
  useAppState,
  AppStateStatus
} from '../src';

/**
 * Advanced app component
 */
const AdvancedApp = () => {
  // State
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [isChecked, setIsChecked] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  
  // Hooks
  const colorScheme = useColorScheme();
  const windowDimensions = useWindowDimensions();
  const appState = useAppState();
  
  // Determine if dark mode is active
  const isDarkMode = colorScheme === ColorSchemeName.DARK;
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Handle app state changes
  useEffect(() => {
    console.log(`App state changed to: ${appState}`);
  }, [appState]);
  
  // Load data from storage
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load from AsyncStorage
      const savedText = await AsyncStorage.getItem('savedText');
      if (savedText) {
        setText(savedText);
      }
      
      // Fetch data from API
      const response = await Networking.get('https://jsonplaceholder.typicode.com/posts?_limit=5');
      setData(response);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };
  
  // Save data to storage
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('savedText', text);
      
      // Show notification
      Notifications.show('Data Saved', {
        body: 'Your data has been saved successfully',
        timeout: 3000
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  // Handle animations
  const animateView = () => {
    // Reset animations
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
    
    // Create animation sequence
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 500,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
      }).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
        }).start(() => {
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
          }).start();
        });
      });
    });
  };
  
  // Create tap gesture handler
  const tapGestureHandler = Gesture.createTapGesture(() => {
    animateView();
  }, { numberOfTaps: 2 });
  
  // Use gesture handler
  const animatedViewRef = useGestureHandler(tapGestureHandler);
  
  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={[styles.listItem, isDarkMode && styles.darkListItem]}>
      <Text style={[styles.listItemTitle, isDarkMode && styles.darkText]}>
        {item.title}
      </Text>
      <Text style={[styles.listItemBody, isDarkMode && styles.darkText]}>
        {item.body}
      </Text>
    </View>
  );
  
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Reactive chmlsh Advanced Demo
        </Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
          Running on {Platform.OS}
        </Text>
        
        <Text style={[styles.infoText, isDarkMode && styles.darkText]}>
          Window size: {windowDimensions.width} x {windowDimensions.height}
        </Text>
        
        <Text style={[styles.infoText, isDarkMode && styles.darkText]}>
          App state: {appState}
        </Text>
        
        <Text style={[styles.infoText, isDarkMode && styles.darkText]}>
          Color scheme: {colorScheme}
        </Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Form Controls
          </Text>
          
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            value={text}
            onChangeText={setText}
            placeholder="Enter text"
            placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
          />
          
          <View style={styles.row}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>
              Toggle Switch
            </Text>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>
              Slider Value: {sliderValue}
            </Text>
            <Slider
              style={styles.slider}
              value={sliderValue}
              minimumValue={0}
              maximumValue={100}
              step={1}
              onValueChange={setSliderValue}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#000000"
            />
          </View>
          
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            label="Check me"
            labelStyle={isDarkMode && styles.darkText}
          />
          
          <View style={styles.buttonRow}>
            <Button
              title="Save Data"
              onPress={saveData}
              color="#4CAF50"
            />
            
            <Button
              title="Show Modal"
              onPress={() => setModalVisible(true)}
              color="#2196F3"
            />
          </View>
        </View>
        
        <Animated.View
          ref={animatedViewRef}
          style={[
            styles.animatedBox,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            },
            isDarkMode && styles.darkAnimatedBox
          ]}
        >
          <Text style={styles.animatedText}>
            Double tap me!
          </Text>
        </Animated.View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Data List
          </Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              style={styles.list}
            />
          )}
        </View>
      </ScrollView>
      
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              Modal Dialog
            </Text>
            
            <Text style={[styles.modalText, isDarkMode && styles.darkText]}>
              This is a modal dialog created with Reactive chmlsh.
            </Text>
            
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              color="#F44336"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

/**
 * Styles for the app
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666666',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666666',
    textAlign: 'center',
  },
  darkText: {
    color: '#FFFFFF',
  },
  section: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkSection: {
    backgroundColor: '#1E1E1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  darkInput: {
    borderColor: '#444444',
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333333',
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  animatedBox: {
    width: 150,
    height: 150,
    backgroundColor: '#3F51B5',
    borderRadius: 75,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  darkAnimatedBox: {
    backgroundColor: '#7986CB',
  },
  animatedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  darkListItem: {
    borderBottomColor: '#333333',
    backgroundColor: '#2A2A2A',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  listItemBody: {
    fontSize: 14,
    color: '#666666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  darkModalContent: {
    backgroundColor: '#1E1E1E',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666666',
  },
});

export default AdvancedApp;
