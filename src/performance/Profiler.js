/**
 * Profiler component for Reactive chmlsh
 * A component for profiling React component performance
 */

import React, { useCallback, useState, useRef } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from '../components/View';
import { Text } from '../components/Text';

/**
 * Profiler component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const Profiler = (props) => {
  const {
    id,
    children,
    onRender,
    showResults = false,
    style,
    ...otherProps
  } = props;

  const [renderTimes, setRenderTimes] = useState([]);
  const renderCount = useRef(0);
  
  // Handle render
  const handleRender = useCallback((
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    renderCount.current += 1;
    
    const renderInfo = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions: Array.from(interactions),
      count: renderCount.current,
      timestamp: Date.now(),
    };
    
    setRenderTimes(prev => {
      const newRenderTimes = [...prev, renderInfo];
      
      // Limit to last 10 renders
      if (newRenderTimes.length > 10) {
        return newRenderTimes.slice(-10);
      }
      
      return newRenderTimes;
    });
    
    if (onRender) {
      onRender(renderInfo);
    }
  }, [onRender]);

  // Default styles
  const defaultStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    results: {
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: 4,
      marginTop: 10,
    },
    resultItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    label: {
      fontWeight: '500',
    },
    value: {
      fontFamily: 'monospace',
    },
    header: {
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });

  // Merge styles
  const containerStyle = StyleSheet.flatten(defaultStyles.container, style);

  // Render results
  const renderResults = () => {
    if (!showResults || renderTimes.length === 0) {
      return null;
    }
    
    const lastRender = renderTimes[renderTimes.length - 1];
    const averageActualDuration = renderTimes.reduce((sum, item) => sum + item.actualDuration, 0) / renderTimes.length;
    const averageBaseDuration = renderTimes.reduce((sum, item) => sum + item.baseDuration, 0) / renderTimes.length;
    
    return (
      <View style={defaultStyles.results}>
        <Text style={defaultStyles.header}>Profiler Results ({id})</Text>
        
        <View style={defaultStyles.resultItem}>
          <Text style={defaultStyles.label}>Render Count:</Text>
          <Text style={defaultStyles.value}>{renderCount.current}</Text>
        </View>
        
        <View style={defaultStyles.resultItem}>
          <Text style={defaultStyles.label}>Last Render Duration:</Text>
          <Text style={defaultStyles.value}>{lastRender.actualDuration.toFixed(2)}ms</Text>
        </View>
        
        <View style={defaultStyles.resultItem}>
          <Text style={defaultStyles.label}>Average Render Duration:</Text>
          <Text style={defaultStyles.value}>{averageActualDuration.toFixed(2)}ms</Text>
        </View>
        
        <View style={defaultStyles.resultItem}>
          <Text style={defaultStyles.label}>Average Base Duration:</Text>
          <Text style={defaultStyles.value}>{averageBaseDuration.toFixed(2)}ms</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={containerStyle} {...otherProps}>
      <React.Profiler id={id} onRender={handleRender}>
        {children}
      </React.Profiler>
      
      {renderResults()}
    </View>
  );
};

/**
 * withProfiler HOC
 * @param {React.Component} Component - Component to wrap
 * @param {Object} options - Profiler options
 * @returns {React.Component} Wrapped component
 */
const withProfiler = (Component, options = {}) => {
  const {
    id = Component.displayName || Component.name || 'Component',
    onRender,
    showResults = false,
  } = options;
  
  const WithProfiler = (props) => (
    <Profiler id={id} onRender={onRender} showResults={showResults}>
      <Component {...props} />
    </Profiler>
  );
  
  WithProfiler.displayName = `withProfiler(${id})`;
  
  return WithProfiler;
};

/**
 * useProfiler hook
 * @param {string} id - Profiler ID
 * @param {Function} onRender - Render callback
 * @returns {Object} Profiler data and functions
 */
const useProfiler = (id, onRender) => {
  const [renderTimes, setRenderTimes] = useState([]);
  const renderCount = useRef(0);
  
  // Handle render
  const handleRender = useCallback((
    profileId,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    renderCount.current += 1;
    
    const renderInfo = {
      id: profileId,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions: Array.from(interactions),
      count: renderCount.current,
      timestamp: Date.now(),
    };
    
    setRenderTimes(prev => {
      const newRenderTimes = [...prev, renderInfo];
      
      // Limit to last 10 renders
      if (newRenderTimes.length > 10) {
        return newRenderTimes.slice(-10);
      }
      
      return newRenderTimes;
    });
    
    if (onRender) {
      onRender(renderInfo);
    }
  }, [onRender]);
  
  // Calculate metrics
  const metrics = {
    renderCount: renderCount.current,
    lastRenderTime: renderTimes.length > 0 ? renderTimes[renderTimes.length - 1].actualDuration : 0,
    averageRenderTime: renderTimes.length > 0
      ? renderTimes.reduce((sum, item) => sum + item.actualDuration, 0) / renderTimes.length
      : 0,
    renderTimes,
  };
  
  // Create profiler props
  const profilerProps = {
    id,
    onRender: handleRender,
  };
  
  return {
    metrics,
    profilerProps,
    renderTimes,
  };
};

export { Profiler, withProfiler, useProfiler };
