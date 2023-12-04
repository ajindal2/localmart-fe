import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const StarRating = ({ rating, onRatingChange, maxStars = 5 }) => {
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => onRatingChange(i)}>
          <Ionicons
            name={i <= rating ? 'ios-star' : 'ios-star-outline'}
            size={20}
            color={i <= rating ? colors.primary : colors.greyColor}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return <View style={{ flexDirection: 'row', padding: 10 }}>{renderStars()}</View>;
};

export default StarRating;