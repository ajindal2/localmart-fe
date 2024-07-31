import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ component: Component, ...props }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!user) {
      navigation.navigate('Auth', { screen: 'WelcomeScreen' });
    }
  }, [user, navigation]);

  if (!user) {
    return null; // or a loading indicator
  }

  return <Component {...props} />;
};

export default ProtectedRoute;
