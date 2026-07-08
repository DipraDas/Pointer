import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Authentication/Login';
import SignUp from '../Screens/Authentication/SignUp';

const Stack = createNativeStackNavigator();

const Root = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={SignUp} />
        </Stack.Navigator>
    );
};

export default Root;