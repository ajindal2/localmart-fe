import React, { useLayoutEffect, useRef, useState } from 'react';
import { Modal, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FullScreenImageModal = ({ isVisible, onClose, imageUrls, initialIndex }) => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  useLayoutEffect(() => {
    if (isVisible && scrollViewRef.current) {
      // Scroll to the initial index image
      scrollViewRef.current.scrollTo({ x: screenWidth * initialIndex, animated: false });
    }
  }, [isVisible, initialIndex, screenWidth]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(newIndex);
  };

  const renderScrollDots = () => {
    if (imageUrls.length > 1) { // Only render dots if more than one image
      return imageUrls.map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.dot,
            currentIndex === index ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ));
    }
    return null; // Don't render dots for a single image
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollViewRef}
        >
          {imageUrls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={{ width: screenWidth, height: '100%' }} />
          ))}
        </ScrollView>
        <View style={styles.dotContainer}>{renderScrollDots()}</View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
  // ... Other styles ...
};

export default FullScreenImageModal;
