import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

const SplashScreen = () => {
  const letters = 'POINTER'.split('');

  const letterAnimations = useRef(
    letters.map(() => new Animated.Value(0))
  ).current;

  const backgroundAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background animation
    Animated.loop(
      Animated.timing(backgroundAnimation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    // Letters animation (Right → Left)
    Animated.stagger(
      2500 / letters.length,
      letterAnimations.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, []);

  const backgroundColor = backgroundAnimation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['#000', '#000', '#000', '#000', '#000'],
  });

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor,
          },
        ]}
      >
        <View style={styles.textRow}>
          {letters.map((letter, index) => {
            const translateX = letterAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [120, 0], // From right
            });

            const opacity = letterAnimations[index];

            const scale = letterAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            });

            return (
              <Animated.Text
                key={index}
                style={[
                  styles.title,
                  {
                    opacity,
                    transform: [{ translateX }, { scale }],
                  },
                ]}
              >
                {letter}
              </Animated.Text>
            );
          })}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 45,
    color: '#fff',
    fontFamily: 'Quantico-Regular',
    marginHorizontal: 5, // Space between letters
  },
});

export default SplashScreen;