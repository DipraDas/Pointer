import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import Login from '../Screens/Authentication/Login';
import SignUp from '../Screens/Authentication/SignUp';
import VerifyLoginOtp from '../Screens/Authentication/VerifyLoginOtp';
import VerifySignupOtp from '../Screens/Authentication/VerifySignupOtp';
import Stacks from './Stacks';

const Stack = createNativeStackNavigator();

const Root = ({ initialRouteName = 'Login' }) => {
    return (
        <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerShown: false,
                animation: 'none',
            }}
        >
            <Stack.Screen
                name="Login"
                component={Login}
            />

            <Stack.Screen
                name="Signup"
                component={SignUp}
            />

            <Stack.Screen
                name="VerifyLoginOtp"
                component={VerifyLoginOtp}
            />

            <Stack.Screen
                name="VerifySignupOtp"
                component={VerifySignupOtp}
            />

            <Stack.Screen
                name="Main"
                component={Stacks}
            />
        </Stack.Navigator>
    );
};

export default Root;