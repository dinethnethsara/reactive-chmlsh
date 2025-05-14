/**
 * FlatList component for Reactive chmlsh
 * An efficient list component similar to React Native's FlatList
 */

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from '../StyleSheet';
import { View } from './View';
import { Text } from './Text';
import { ScrollView } from './ScrollView';

/**
 * FlatList component
 * @param {Object} props - Component properties
 * @returns {React.Element} Rendered component
 */
const FlatList = (props) => {
  const {
    data = [],
    renderItem,
    keyExtractor,
    horizontal = false,
    initialNumToRender = 10,
    onEndReached,
    onEndReachedThreshold = 0.5,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    ItemSeparatorComponent,
    inverted = false,
    style,
    contentContainerStyle,
    ...scrollViewProps
  } = props;

  const [visibleData, setVisibleData] = useState([]);
  const [isEndReached, setIsEndReached] = useState(false);
  const scrollViewRef = useRef(null);
  const listRef = useRef(null);

  // Initialize visible data
  useEffect(() => {
    if (data.length > 0) {
      const initialData = data.slice(0, initialNumToRender);
      setVisibleData(initialData);
    } else {
      setVisibleData([]);
    }
    setIsEndReached(false);
  }, [data, initialNumToRender]);

  // Handle scroll events to implement infinite scrolling
  const handleScroll = (event) => {
    if (scrollViewProps.onScroll) {
      scrollViewProps.onScroll(event);
    }

    if (onEndReached && !isEndReached) {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      
      const distanceFromEnd = horizontal
        ? contentSize.width - layoutMeasurement.width - contentOffset.x
        : contentSize.height - layoutMeasurement.height - contentOffset.y;
      
      const threshold = horizontal
        ? layoutMeasurement.width * onEndReachedThreshold
        : layoutMeasurement.height * onEndReachedThreshold;
      
      if (distanceFromEnd < threshold) {
        setIsEndReached(true);
        onEndReached({ distanceFromEnd });
        
        // Reset end reached flag after a delay to prevent multiple calls
        setTimeout(() => {
          setIsEndReached(false);
        }, 1000);
      }
    }
  };

  // Render list items
  const renderListItems = () => {
    if (data.length === 0 && ListEmptyComponent) {
      return React.isValidElement(ListEmptyComponent)
        ? ListEmptyComponent
        : <ListEmptyComponent />;
    }

    return visibleData.map((item, index) => {
      const key = keyExtractor ? keyExtractor(item, index) : `item-${index}`;
      
      const itemContent = renderItem({
        item,
        index,
        separators: {
          highlight: () => {},
          unhighlight: () => {},
          updateProps: () => {},
        },
      });

      const separator = ItemSeparatorComponent && index < visibleData.length - 1
        ? React.isValidElement(ItemSeparatorComponent)
          ? ItemSeparatorComponent
          : <ItemSeparatorComponent />
        : null;

      return (
        <React.Fragment key={key}>
          {itemContent}
          {separator}
        </React.Fragment>
      );
    });
  };

  // Default styles
  const defaultStyle = {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  };

  // Merge styles
  const mergedStyle = StyleSheet.flatten(defaultStyle, style);

  // Handle inverted list
  const invertedStyle = inverted
    ? {
        transform: horizontal ? 'scaleX(-1)' : 'scaleY(-1)',
      }
    : {};

  // Merge content container styles
  const mergedContentContainerStyle = StyleSheet.flatten(
    contentContainerStyle,
    invertedStyle
  );

  // Render header component
  const header = ListHeaderComponent
    ? React.isValidElement(ListHeaderComponent)
      ? ListHeaderComponent
      : <ListHeaderComponent />
    : null;

  // Render footer component
  const footer = ListFooterComponent
    ? React.isValidElement(ListFooterComponent)
      ? ListFooterComponent
      : <ListFooterComponent />
    : null;

  return (
    <ScrollView
      ref={scrollViewRef}
      style={mergedStyle}
      contentContainerStyle={mergedContentContainerStyle}
      horizontal={horizontal}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      {...scrollViewProps}
    >
      <View ref={listRef} style={inverted ? invertedStyle : {}}>
        {header}
        {renderListItems()}
        {footer}
      </View>
    </ScrollView>
  );
};

export { FlatList };
