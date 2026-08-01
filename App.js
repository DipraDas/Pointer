import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import SplashScreen from './Source/Screens/SplashScreen/SplashScreen';
import Root from './Source/Navigation/Root';
import { store } from './Source/Redux/Store';

function App() {
  const [counter, setCounter] = useState(3);
  const [email, setEmail] = useState(null);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const savedAccessToken =
          await AsyncStorage.getItem('accessToken');

        const savedUsername =
          await AsyncStorage.getItem('username');

        const savedEmail =
          await AsyncStorage.getItem('email');

        console.log('Saved access token:', savedAccessToken);
        console.log('Saved username:', savedUsername);
        console.log('Saved email:', savedEmail);

        // Navigation depends on the saved email
        setEmail(savedEmail);
      } catch (error) {
        console.log('Error reading stored user data:', error);
        setEmail(null);
      } finally {
        setIsCheckingStorage(false);
      }
    };

    checkStoredUser();
  }, []);

  useEffect(() => {
    if (counter <= 0) return;

    const timer = setTimeout(() => {
      setCounter(previousCounter => previousCounter - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter]);

  const showSplashScreen =
    counter > 0 || isCheckingStorage;

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        {showSplashScreen ? (
          <SplashScreen />
        ) : (
          <NavigationContainer>
            <Root
              initialRouteName={email ? 'Main' : 'Login'}
            />
          </NavigationContainer>
        )}
      </View>
    </Provider>
  );
}

export default App;