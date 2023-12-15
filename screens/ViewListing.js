import React, { useState, useContext, useEffect, Fragment } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AuthContext } from '../AuthContext';
import { getUserProfile } from '../api/UserProfileService';
import { getSellerRatings } from '../api/RatingsService';

const ViewListing = ({ route, navigation }) => {
    const { item } = route.params;
    const screenWidth = Dimensions.get('window').width;
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState(null);
    const [sellerRatings, setSellerRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0); 

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    const formatDateToMonthYear = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthName = monthNames[date.getMonth()];
    return `${monthName} ${year}`;
    };

    const handleScroll = (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / screenWidth);
      setCurrentIndex(newIndex);
    };
  
    const renderScrollDots = () => {
      return item.imageUrls.map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.dot,
            currentIndex === index ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ));
    };

    // Placeholder for seller details (replace with actual data)
    /*const sellerDetails = {
        name: "John Doe",
        image: "https://via.placeholder.com/150", // Replace with actual seller image URL
    };*/

    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const profile = await getUserProfile(user._id);
            setUserProfile(profile);
            console.log('userProfile name: ', profile.aboutMe);
          } catch (error) {
            console.error('Error fetching user profile', error);
          }
        };
  
        const fetchSellerRatings = async () => {
            console.log('Inside fetchSellerRatings');
          try {
            const { averageRating, ratings } = await getSellerRatings(item.sellerId);
            setSellerRatings(ratings);
            setAverageRating(averageRating); 
            console.log('Average rating in teh ViewListing screen: ', averageRating);
          } catch (error) {
            console.error('Error fetching seller ratings', error);
          }
        };
  
        if (user && user._id) {
          fetchUserProfile();
        }
        
        if (item && item.sellerId) {
          fetchSellerRatings();
        }
      }, [user, item]);


  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
      {/* Section 1: Images, Title, and Price */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        //ref={scrollViewRef}
      >
       {item.imageUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={[styles.image, { width: screenWidth }]} />
        ))}
      </ScrollView>
      <View style={styles.dotContainer}>{renderScrollDots()}</View>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <View style={styles.separator} />

      {/* Section 2: Seller Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seller Details</Text>
        {
            userProfile ? (
            <View>
                <View style={styles.sellerDetails}>
                <Image source={{ uri: userProfile.profilePicture }} style={styles.sellerImage} />
                <Text style={styles.sellerName}>{user.userName}</Text>
                <Text style={styles.sellerName}>{formatDateToMonthYear(user.date)}</Text>
                </View>
                {sellerRatings.length > 0 ? (
                    <Text>Average Rating: {averageRating.toFixed(1)} ({sellerRatings.length})</Text>
                ) : (
                <Text>No ratings available.</Text>
                )}
            </View>
            ) : (
            <Text>Loading seller details...</Text>
            )
        }
        </View>

      <View style={styles.separator} />

       {/* Section 3: Description */}
       <Text style={styles.sectionTitle}>Description</Text>
       <Text style={styles.description}>{item.description}</Text>
       <View style={styles.separator} />

       {/* Section 4: More like this */}
       <Text style={styles.sectionTitle}>More items like this</Text>

    </ScrollView>

    <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]}>
          <Text style={styles.buttonText}>Schedule pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Message seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  section: {
    marginTop: 1,
  },
  container: {
    flex: 1,
    marginBottom: 60, // Height of the button container
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: 'dodgerblue',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  primaryButton: {
    backgroundColor: 'red', // Primary button color
  },
  scrollView: {
    flex: 1,
  },
  listingImage: {
    width: 200,
    height: 200,
    // other styles
  },
  description: {
    // styling for description
  },
  image: {
    height: 250,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  price: {
    fontSize: 18,
    color: 'grey',
    //marginBottom: 10,
    marginLeft: 10,
  },
  description: {
    margin: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sellerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginHorizontal: 10,
  },
  sellerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
  },
  sellerName: {
    fontSize: 16,
    marginLeft: 10,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 10, // Adjust as needed
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
    borderRadius: 15,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'black', // Color for active dot
  },
  inactiveDot: {
    backgroundColor: 'white', // Color for inactive dots
  },
});

export default ViewListing;
