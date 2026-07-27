import { Image, View, Animated, Pressable, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import ProfileScreen from '../Screens/ProfileScreen/ProfileScreen';
import MapScreen from '../Screens/MapScreen/MapScreen';
import Root from './Root';
import Login from '../Screens/Authentication/Login';
import SignUp from '../Screens/Authentication/SignUp';
import VerifySignupOtp from '../Screens/Authentication/VerifySignupOtp';
import VerifyLoginOtp from '../Screens/Authentication/VerifyLoginOtp';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};
const Stacks = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
            <Stack.Screen name="Main" component={MainTab} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={SignUp} />
            <Stack.Screen name="VerifyLoginOtp" component={VerifyLoginOtp} />
            <Stack.Screen name="VerifySignupOtp" component={VerifySignupOtp} />
        </Stack.Navigator>
    )
}

export default Stacks;