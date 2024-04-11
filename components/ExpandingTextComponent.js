import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

const ExpandingTextComponent = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const fullHeightRef = useRef(null);
  const limitedHeightRef = useRef(null);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  const measureView = (event, type) => {
    const height = event.nativeEvent.layout.height;
    if (type === 'full') {
      fullHeightRef.current = height;
    } else {
      limitedHeightRef.current = height;
    }

    if (fullHeightRef.current && limitedHeightRef.current) {
      if (fullHeightRef.current > limitedHeightRef.current) {
        setShowSeeMore(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Invisible Text to measure full height */}
      <Text
        style={[styles.text, styles.hidden]}
        onLayout={(event) => measureView(event, 'full')}
      >
        {description}
      </Text>

      {/* Visible Text */}
      <Text
        style={styles.text}
        numberOfLines={isExpanded ? undefined : 3}
        onLayout={(event) => measureView(event, 'limited')}
      >
        {description}
      </Text>

      {showSeeMore && !isExpanded && (
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.seeMoreText}>See more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    // Container styles
  },
  text: {
    paddingBottom: spacing.size10Vertical,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    height: 'auto', // Remove any height restriction
    width: '100%', // Ensure the text width matches the visible text
  },
  seeMoreText: {
    color: colors.primary,
    //marginTop: spacing.size5Vertical,
  },
});

export default ExpandingTextComponent;
