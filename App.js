// App.js
import React from 'react';
import AppNavigator from './AppNavigator';
import Toast from 'react-native-toast-message';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

/*const App = () => {
  return <AppNavigator />;
};*/

const App = () => {
  return (
    <ActionSheetProvider>
    <>
      <AppNavigator />
      <Toast />
    </>
  </ActionSheetProvider>
  );
}

export default App;