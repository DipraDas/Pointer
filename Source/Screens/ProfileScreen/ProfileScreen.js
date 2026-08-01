import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import {
    setEmail,
    setPassword,
    setUser,
} from '../../Redux/Features/Authentication/AuthSlice';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [email, setStoredEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUserInformation = async () => {
            try {
                const savedUsername =
                    await AsyncStorage.getItem('username');

                const savedEmail =
                    await AsyncStorage.getItem('email');

                setUsername(savedUsername || 'User');
                setStoredEmail(savedEmail || 'No email available');
            } catch (error) {
                console.log(
                    'Error reading user information:',
                    error,
                );
            } finally {
                setIsLoading(false);
            }
        };

        getUserInformation();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('email');

            dispatch(setUser(null));
            dispatch(setEmail(''));
            dispatch(setPassword(''));

            let rootNavigation = navigation;

            while (rootNavigation.getParent()) {
                rootNavigation = rootNavigation.getParent();
            }

            rootNavigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

            console.log('Logout successful');
        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    const firstLetter =
        username && username !== 'User'
            ? username.charAt(0).toUpperCase()
            : 'U';

    return (
        <>
            <StatusBar
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>PROFILE</Text>

                    <Text style={styles.headerSubtitle}>
                        Your account information
                    </Text>
                </View>

                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="#000000"
                    />
                ) : (
                    <>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {firstLetter}
                            </Text>
                        </View>

                        <Text style={styles.username}>
                            {username}
                        </Text>

                        <Text style={styles.userEmail}>
                            {email}
                        </Text>

                        <View style={styles.informationCard}>
                            <View style={styles.informationItem}>
                                <Text style={styles.label}>
                                    FULL NAME
                                </Text>

                                <Text style={styles.value}>
                                    {username}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.informationItem}>
                                <Text style={styles.label}>
                                    EMAIL ADDRESS
                                </Text>

                                <Text style={styles.value}>
                                    {email}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.logoutButtonText}>
                                LOGOUT
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                <View style={styles.bottomContainer}>
                    <Text style={styles.developedText}>
                        Developed by
                    </Text>

                    <Text style={styles.instituteText}>
                        Melbourne Institute of Technology
                    </Text>
                </View>
            </View>
        </>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 60,
    },

    header: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },

    headerTitle: {
        color: '#000000',
        fontSize: 32,
        fontFamily: 'Quantico-Bold',
        letterSpacing: 8,
    },

    headerSubtitle: {
        color: '#777777',
        fontSize: 14,
        letterSpacing: 1,
        marginTop: 5,
    },

    avatar: {
        width: 95,
        height: 95,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        borderRadius: 48,
        marginBottom: 15,
    },

    avatarText: {
        color: '#FFFFFF',
        fontSize: 38,
        fontFamily: 'Quantico-Bold',
    },

    username: {
        color: '#000000',
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 1,
    },

    userEmail: {
        color: '#777777',
        fontSize: 14,
        marginTop: 5,
    },

    informationCard: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 14,
        marginTop: 35,
        paddingHorizontal: 20,
    },

    informationItem: {
        paddingVertical: 18,
    },

    label: {
        color: '#888888',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1.5,
        marginBottom: 7,
    },

    value: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },

    divider: {
        height: 1,
        backgroundColor: '#DDDDDD',
    },

    logoutButton: {
        width: '90%',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 10,
        paddingVertical: 15,
        marginTop: 30,
    },

    logoutButtonText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 2,
    },

    bottomContainer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
    },

    developedText: {
        color: '#999999',
        fontSize: 12,
    },

    instituteText: {
        color: '#000000',
        fontSize: 12,
        letterSpacing: 1,
        marginTop: 3,
    },
});