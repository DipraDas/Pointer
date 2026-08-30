import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import SplashScreen from './Source/Screens/SplashScreen/SplashScreen';
import Root from './Source/Navigation/Root';
import { store } from './Source/Redux/Store';

import {
  setupFCM,
  requestNotificationPermission,
  createNotificationChannel,
  listenForForegroundNotifications,
} from './Source/Services/NotificationService';

function App() {
  // =============================
  // ALL HOOKS MUST ALWAYS BE HERE
  // =============================

  const [counter, setCounter] = useState(3);
  const [email, setEmail] = useState(null);
  const [isCheckingStorage, setIsCheckingStorage] =
    useState(true);

  // Notifications
  useEffect(() => {
    let unsubscribe;

    const initializeNotifications = async () => {
      try {
        // 1. Ask permission
        await requestNotificationPermission();

        // 2. Create Android notification channel
        await createNotificationChannel();

        // 3. Get FCM token
        const token = await setupFCM();

        console.log('App FCM token:', token);

        // 4. Listen for foreground notifications
        unsubscribe =
          listenForForegroundNotifications();

      } catch (error) {
        console.log(
          'Notification initialization error:',
          error,
        );
      }
    };

    initializeNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Check stored login
  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const savedAccessToken =
          await AsyncStorage.getItem('accessToken');

        const savedUsername =
          await AsyncStorage.getItem('username');

        const savedEmail =
          await AsyncStorage.getItem('email');

        console.log(
          'Saved access token:',
          savedAccessToken,
        );

        console.log(
          'Saved username:',
          savedUsername,
        );

        console.log(
          'Saved email:',
          savedEmail,
        );

        // Require a token as well as email
        setEmail(
          savedAccessToken && savedEmail
            ? savedEmail
            : null,
        );

      } catch (error) {
        console.log(
          'Error reading stored user data:',
          error,
        );

        setEmail(null);

      } finally {
        setIsCheckingStorage(false);
      }
    };

    checkStoredUser();
  }, []);

  // Splash timer
  useEffect(() => {
    if (counter <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCounter(previousCounter =>
        previousCounter - 1,
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter]);

  // =============================
  // NO HOOKS BELOW THIS POINT
  // =============================

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
              initialRouteName={
                email ? 'Main' : 'Login'
              }
            />
          </NavigationContainer>
        )}
      </View>
    </Provider>
  );
}

export default App;