import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const StarRating = React.memo(({ rating, onRatingChange, maxStars = 5, size = 20  }) => {
  const renderStars = () => {
    let stars = [];
    const floorRating = Math.floor(rating);
    const isHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= maxStars; i++) {
      let starIconName = 'ios-star-outline';

      if (i <= floorRating) {
        starIconName = 'star'; // Full star
      } else if (isHalfStar && i === floorRating + 1) {
        starIconName = 'ios-star-half'; // Half star
      } else {
        starIconName = 'star'; // Empty star
      }

      const star = (
        <Ionicons
          key={i}
          name={starIconName}
          size={size}
          color={i <= rating ? colors.primary : colors.greyColor}
        />
      );

      if (onRatingChange) {
        stars.push(
          <TouchableOpacity key={i} onPress={() => onRatingChange(i)}>
            {star}
          </TouchableOpacity>
        );
      } else {
        stars.push(star);
      }
    }
    return stars;
  };

  return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>;
});

export default StarRating;
