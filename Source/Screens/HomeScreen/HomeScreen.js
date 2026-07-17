import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ fontSize: 18 }}>Go to login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;