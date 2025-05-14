/**
 * Simple example app for Reactive chmlsh
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  Image, 
  StyleSheet, 
  Platform, 
  Dimensions,
  Animated 
} from '../src';

/**
 * Simple counter app
 */
const SimpleApp = () => {
  const [count, setCount] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // Handle increment button press
  const handleIncrement = () => {
    // Animate opacity
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
    }).start(() => {
      // Update count
      setCount(count + 1);
      
      // Animate back to full opacity
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
      }).start();
    });
  };
  
  // Handle decrement button press
  const handleDecrement = () => {
    if (count > 0) {
      // Animate opacity
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
      }).start(() => {
        // Update count
        setCount(count - 1);
        
        // Animate back to full opacity
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
        }).start();
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reactive chmlsh Example</Text>
      <Text style={styles.subtitle}>
        Running on {Platform.OS}
      </Text>
      
      <Animated.View style={[styles.counterContainer, { opacity: fadeAnim }]}>
        <Text style={styles.counterText}>{count}</Text>
      </Animated.View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Decrement"
          onPress={handleDecrement}
          disabled={count === 0}
          color="#FF6B6B"
        />
        <Button
          title="Increment"
          onPress={handleIncrement}
          color="#4ECDC4"
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Window Dimensions: {Dimensions.get().window.width} x {Dimensions.get().window.height}
        </Text>
        <Text style={styles.infoText}>
          Created by Don PPPredrick College
        </Text>
        <Text style={styles.infoText}>
          Developed by Dineth Nethsara
        </Text>
      </View>
    </View>
  );
};

/**
 * Styles for the app
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7FFF7',
    height: '100vh',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1A535C',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#4ECDC4',
  },
  counterContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  counterText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 30,
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
});

export default SimpleApp;
