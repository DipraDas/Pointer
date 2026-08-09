import React from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import ProfileScreen from '../Screens/ProfileScreen/ProfileScreen';
import MapScreen from '../Screens/MapScreen/MapScreen';
import ChangePasswordScreen from '../Screens/Authentication/ChangePasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
    Home: {
        active: require('../Images/Navigation/home-active.png'),
        inactive: require('../Images/Navigation/home.png'),
    },

    Map: {
        active: require('../Images/Navigation/location-active.png'),
        inactive: require('../Images/Navigation/location.png'),
    },

    Profile: {
        active: require('../Images/Navigation/user-active.png'),
        inactive: require('../Images/Navigation/user.png'),
    },
};

const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,

                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,

                // Remove Android ripple effect
                tabBarButton: props => (
                    <Pressable
                        {...props}
                        android_ripple={{
                            color: 'transparent',
                        }}
                    />
                ),

                tabBarIcon: ({ focused }) => {
                    const selectedIcon = focused
                        ? TAB_ICONS[route.name].active
                        : TAB_ICONS[route.name].inactive;

                    return (
                        <View
                            style={[
                                styles.tabContent,
                                focused && styles.activeTabContent,
                            ]}
                        >
                            <View
                                style={[
                                    styles.iconCircle,
                                    focused && styles.activeIconCircle,
                                ]}
                            >
                                <Image
                                    source={selectedIcon}
                                    resizeMode="contain"
                                    style={[
                                        styles.icon,
                                        {
                                            tintColor: focused
                                                ? '#000000'
                                                : '#A0A0A0',
                                        },
                                    ]}
                                />
                            </View>

                            <Text
                                style={[
                                    styles.tabLabel,
                                    focused && styles.activeTabLabel,
                                ]}
                            >
                                {route.name}
                            </Text>

                            {focused && (
                                <View style={styles.activeDot} />
                            )}
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
            />

            <Tab.Screen
                name="Map"
                component={MapScreen}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Tab.Navigator>
    );
};

const Stacks = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'none',
            }}
        >
            <Stack.Screen
                name="MainTab"
                component={MainTab}
            />

            <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
            />
        </Stack.Navigator>
    );
};

export default Stacks;

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        left: 18,
        right: 18,

        height: 60,
        paddingTop: 7,
        paddingBottom: 7,

        backgroundColor: '#111111',
        borderTopWidth: 0,

        elevation: 18,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },

    tabBarItem: {
        height: 62,
    },

    tabContent: {
        width: 90,
        height: 62,
        justifyContent: 'center',
        alignItems: 'center',
    },

    activeTabContent: {
        transform: [{ translateY: -9 }],
    },

    iconCircle: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },

    activeIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',

        borderWidth: 4,
        borderColor: '#111111',

        elevation: 10,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },

    icon: {
        width: 23,
        height: 23,
    },

    tabLabel: {
        color: '#777777',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginTop: 1,
    },

    activeTabLabel: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginTop: 2,
    },

    activeDot: {
        width: 4,
        height: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        marginTop: 2,
    },
});