import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity, Text } from 'react-native';
import MapView, { Circle } from 'react-native-maps';

const ListingMap = ({ location }) => {
    // Since coordinates are stored as [longitude, latitude]
    const longitude = location.coordinates[0];
    const latitude = location.coordinates[1];

    // Define the radius for the circle to represent the general area (in meters)
    const radius = 500; // Adjust the radius as needed for privacy

    // Randomize function to adjust the latitude and longitude
    const randomizeLocation = (coordinate) => {
        const radius = 0.002; // Determines the range of randomization
        return coordinate + (Math.random() - 0.5) * radius * 2; // Adjusts the coordinate within a specified range
    };

    // TODO randomize the center
    const randomizedLatitude = randomizeLocation(latitude);
    const randomizedLongitude = randomizeLocation(longitude);

    const openMapsApp = (latitude, longitude) => {
        // For iOS, use the maps.apple.com URL with the 'll' parameter to specify latitude and longitude
        // without adding a pin.
        const iosMapsUrl = `http://maps.apple.com/?ll=${latitude},${longitude}&z=15`;

        // For Android, use the geo: URI scheme with latitude and longitude, but without the 'q' parameter
        // to avoid adding a pin.
        const androidMapsUrl = `geo:${latitude},${longitude}?z=15`;

        const platformUrl = Platform.OS === 'ios' ? iosMapsUrl : androidMapsUrl;

        Linking.canOpenURL(platformUrl)
          .then((supported) => {
            if (supported) {
              return Linking.openURL(platformUrl);
            } else {
              console.log("Don't know how to open this URL: " + platformUrl);
            }
          })
          .catch((err) => console.error('An error occurred', err));
      };

      
    return (
        <View style={styles.container}>

        <MapView
            style={styles.map}
            initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01, // Zoom level for the map
            longitudeDelta: 0.01, // Zoom level for the map
            }}
        >
            <Circle
            center={{ latitude: latitude, longitude: longitude }}
            radius={radius}
            strokeWidth={2}
            strokeColor="#ff9191" // Example stroke color
            fillColor="rgba(247, 121, 121, 0.2)" // Fill color of the circle
            />
        </MapView>
        <TouchableOpacity
            style={styles.overlayButton}
            onPress={() => openMapsApp(latitude, longitude)}
        >
            <Text style={styles.overlayButtonText}>Open in Maps</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    height: 100, // Set the desired height for the map container
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayButton: {
    position: 'absolute',
    bottom: 20, // Adjust based on your layout
    right: 20, // Adjust based on your layout
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  overlayButtonText: {
    color: '#fff',
    // Add other text styles as needed
  },
});

export default ListingMap;

  