import React, { useEffect, useState } from 'react';
import { StatusBar, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './Source/Screens/SplashScreen/SplashScreen';

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
      {/* {counter > 0 ? ( */}
        <SplashScreen />
      {/* ) : (
        <Text style={{ color: 'red' }}>Hellllo</Text>
      )} */}
    </View>
  );
}

export default App;