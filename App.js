import React, { useEffect, useState } from 'react';
import { StatusBar, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './Source/Screens/SplashScreen/SplashScreen';
import Stacks from './Source/Navigation/Stacks';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    if (counter <= 0) return;

    const timer = setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter]);

  return (
    <View style={{ flex: 1 }}>
      {counter > 0 ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stacks />
        </NavigationContainer>
      )}
    </View>
  );
}

export default App;