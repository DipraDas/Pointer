import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StatusBar,
    StyleSheet,
    Text,
} from 'react-native';

const SplashScreen = () => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();
    }, []);

    // Animated Background Color
    const backgroundColor = animation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
            '#000', 
            '#000',
            '#04001c',
            '#000',
            '#000',
        ],
    });

    // Breathing Logo Animation
    const scale = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.1, 1],
    });

    const opacity = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.8, 1, 0.8],
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
                <Animated.Text
                    style={[
                        styles.title,
                        {
                            transform: [{ scale }],
                            opacity,
                        },
                    ]}
                >
                    P O I N T E R
                </Animated.Text>
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

    title: {
        fontSize: 45,
        color: '#fff',
        letterSpacing: 2,
      fontFamily: 'Quantico-Regular'
    },

    loading: {
        marginTop: 20,
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
});

export default SplashScreen;