import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DEMO_USERS = [
    {
        id: '1',
        name: 'John Pyn',
        relationship: 'Son',
        location: 'Melbourne Institute of Technology',
        updatedAt: 'Updated just now',
        status: 'Active',
        initials: 'JP',
    },
    {
        id: '2',
        name: 'Sarah Das',
        relationship: 'Sister',
        location: 'Penrith Station, NSW',
        updatedAt: 'Updated 2 minutes ago',
        status: 'Active',
        initials: 'SD',
    },
    {
        id: '3',
        name: 'Michael Das',
        relationship: 'Father',
        location: 'Westfield Penrith, NSW',
        updatedAt: 'Updated 5 minutes ago',
        status: 'Active',
        initials: 'MD',
    },
];

const HomeScreen = () => {
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUserInformation = async () => {
            try {
                const savedUsername =
                    await AsyncStorage.getItem('username');

                setUsername(savedUsername || 'User');
            } catch (error) {
                console.log(
                    'Error getting username:',
                    error,
                );

                setUsername('User');
            } finally {
                setIsLoading(false);
            }
        };

        getUserInformation();
    }, []);

    const getGreeting = () => {
        const currentHour = new Date().getHours();

        if (currentHour < 12) {
            return 'Good morning';
        }

        if (currentHour < 18) {
            return 'Good afternoon';
        }

        return 'Good evening';
    };

    const openMap = user => {
        console.log('Selected user:', user);

        navigation.navigate('Map', {
            selectedUser: user,
        });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar
                    backgroundColor="#FFFFFF"
                    barStyle="dark-content"
                />

                <ActivityIndicator
                    size="large"
                    color="#000000"
                />
            </View>
        );
    }

    return (
        <>
            <StatusBar
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}

                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>
                            {getGreeting()}
                        </Text>

                        <Text style={styles.username}>
                            {username}
                        </Text>
                    </View>

                    <View style={styles.profileCircle}>
                        <Text style={styles.profileInitial}>
                            {username.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Safety status */}

                <View style={styles.safetyCard}>
                    <View style={styles.safetyTop}>
                        <View style={styles.shieldContainer}>
                            <Text style={styles.shieldIcon}>✓</Text>
                        </View>

                        <View style={styles.safetyTextContainer}>
                            <Text style={styles.safetyLabel}>
                                CURRENT STATUS
                            </Text>

                            <Text style={styles.safetyTitle}>
                                Everyone is safe
                            </Text>
                        </View>

                        <View style={styles.onlineBadge}>
                            <View style={styles.onlineDot} />

                            <Text style={styles.onlineText}>
                                LIVE
                            </Text>
                        </View>
                    </View>

                    <View style={styles.safetyDivider} />

                    <View style={styles.safetyStatistics}>
                        <View style={styles.statistic}>
                            <Text style={styles.statisticNumber}>
                                3
                            </Text>

                            <Text style={styles.statisticLabel}>
                                People
                            </Text>
                        </View>

                        <View style={styles.verticalDivider} />

                        <View style={styles.statistic}>
                            <Text style={styles.statisticNumber}>
                                3
                            </Text>

                            <Text style={styles.statisticLabel}>
                                Online
                            </Text>
                        </View>

                        <View style={styles.verticalDivider} />

                        <View style={styles.statistic}>
                            <Text style={styles.statisticNumber}>
                                0
                            </Text>

                            <Text style={styles.statisticLabel}>
                                Alerts
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Quick actions */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Quick Actions
                    </Text>
                </View>

                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        activeOpacity={0.75}
                    >
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionIconText}>
                                👥
                            </Text>
                        </View>

                        <Text style={styles.actionTitle}>
                            My Family
                        </Text>

                        <Text style={styles.actionSubtitle}>
                            3 members
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('Map')}
                        activeOpacity={0.75}
                    >
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionIconText}>
                                ⦿
                            </Text>
                        </View>

                        <Text style={styles.actionTitle}>
                            Live Tracking
                        </Text>

                        <Text style={styles.actionSubtitle}>
                            Open map
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionCard,
                            styles.sosActionCard,
                        ]}
                        activeOpacity={0.75}
                    >
                        <View
                            style={[
                                styles.actionIcon,
                                styles.sosActionIcon,
                            ]}
                        >
                            <Text style={styles.sosIconText}>!</Text>
                        </View>

                        <Text style={styles.actionTitle}>
                            SOS Alerts
                        </Text>

                        <Text style={styles.actionSubtitle}>
                            View history
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Last SOS */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Last SOS Triggered
                    </Text>

                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>
                            View history
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sosCard}>
                    <View style={styles.sosHeader}>
                        <View style={styles.alertIconContainer}>
                            <Text style={styles.alertIcon}>!</Text>
                        </View>

                        <View style={styles.sosHeaderText}>
                            <Text style={styles.sosTitle}>
                                Emergency alert
                            </Text>

                            <Text style={styles.sosStatus}>
                                Resolved
                            </Text>
                        </View>

                        <View style={styles.resolvedBadge}>
                            <View style={styles.resolvedDot} />

                            <Text style={styles.resolvedText}>
                                SAFE
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sosInformation}>
                        <View style={styles.sosInformationItem}>
                            <Text style={styles.sosInformationLabel}>
                                TRIGGERED BY
                            </Text>

                            <Text style={styles.sosInformationValue}>
                                John Pyn
                            </Text>
                        </View>

                        <View style={styles.sosInformationItem}>
                            <Text style={styles.sosInformationLabel}>
                                DATE
                            </Text>

                            <Text style={styles.sosInformationValue}>
                                29 June 2026
                            </Text>
                        </View>

                        <View style={styles.sosInformationItem}>
                            <Text style={styles.sosInformationLabel}>
                                TIME
                            </Text>

                            <Text style={styles.sosInformationValue}>
                                11:45 PM
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sosLocation}>
                        <Text style={styles.locationPin}>●</Text>

                        <Text
                            style={styles.sosLocationText}
                            numberOfLines={1}
                        >
                            Penrith Station, NSW
                        </Text>
                    </View>
                </View>

                {/* Live locations */}
{/* 
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Live Location Updates
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Map')}
                    >
                        <Text style={styles.viewAllText}>
                            View map
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.locationList}>
                    {DEMO_USERS.map((user, index) => (
                        <TouchableOpacity
                            key={user.id}
                            style={[
                                styles.locationItem,
                                index !== DEMO_USERS.length - 1 &&
                                styles.locationItemBorder,
                            ]}
                            onPress={() => openMap(user)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.userAvatar}>
                                <Text style={styles.userAvatarText}>
                                    {user.initials}
                                </Text>
                            </View>

                            <View style={styles.userInformation}>
                                <View style={styles.userNameRow}>
                                    <Text style={styles.locationUserName}>
                                        {user.name}
                                    </Text>

                                    <Text style={styles.relationship}>
                                        {' '}
                                        ({user.relationship})
                                    </Text>
                                </View>

                                <Text
                                    style={styles.currentLocation}
                                    numberOfLines={1}
                                >
                                    {user.location}
                                </Text>

                                <Text style={styles.updatedTime}>
                                    {user.updatedAt}
                                </Text>
                            </View>

                            <View style={styles.userStatus}>
                                <View style={styles.activeStatusDot} />

                                <Text style={styles.activeStatusText}>
                                    {user.status}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View> */}
            </ScrollView>
        </>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    contentContainer: {
        paddingHorizontal: 18,
        paddingTop: 35,
        paddingBottom: 120,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },

    greeting: {
        color: '#777777',
        fontSize: 16,
        letterSpacing: 0.8,
    },

    username: {
        color: '#000000',
        fontSize: 30,
        fontFamily: 'Quantico-Bold',
        letterSpacing: 1,
        marginTop: 1,
    },

    profileCircle: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        borderRadius: 24,
    },

    profileInitial: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: '700',
    },

    safetyCard: {
        width: '100%',
        backgroundColor: '#111111',
        borderRadius: 20,
        padding: 18,
    },

    safetyTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    shieldContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
    },

    shieldIcon: {
        color: '#000000',
        fontSize: 25,
        fontWeight: '800',
    },

    safetyTextContainer: {
        flex: 1,
        marginLeft: 13,
    },

    safetyLabel: {
        color: '#888888',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.3,
    },

    safetyTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 3,
    },

    onlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#252525',
        borderRadius: 12,
        paddingHorizontal: 9,
        paddingVertical: 6,
    },

    onlineDot: {
        width: 6,
        height: 6,
        backgroundColor: '#4CCB71',
        borderRadius: 3,
        marginRight: 5,
    },

    onlineText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },

    safetyDivider: {
        height: 1,
        backgroundColor: '#303030',
        marginVertical: 16,
    },

    safetyStatistics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    statistic: {
        flex: 1,
        alignItems: 'center',
    },

    statisticNumber: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '700',
    },

    statisticLabel: {
        color: '#888888',
        fontSize: 12,
        marginTop: 2,
    },

    verticalDivider: {
        width: 1,
        height: 30,
        alignSelf: 'center',
        backgroundColor: '#303030',
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 27,
        marginBottom: 12,
    },

    sectionTitle: {
        color: '#000000',
        fontSize: 19,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    viewAllText: {
        color: '#777777',
        fontSize: 13,
        fontWeight: '600',
    },

    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    actionCard: {
        width: '31.5%',
        minHeight: 125,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 17,
        paddingHorizontal: 7,
        paddingVertical: 13,
    },

    sosActionCard: {
        backgroundColor: '#FFF7F7',
        borderColor: '#F5DDDD',
    },

    actionIcon: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
        borderRadius: 21,
        marginBottom: 9,
    },

    actionIconText: {
        color: '#000000',
        fontSize: 21,
        fontWeight: '700',
    },

    sosActionIcon: {
        backgroundColor: '#FFE1E1',
    },

    sosIconText: {
        color: '#D63031',
        fontSize: 24,
        fontWeight: '800',
    },

    actionTitle: {
        color: '#000000',
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    },

    actionSubtitle: {
        color: '#999999',
        fontSize: 11,
        marginTop: 3,
        textAlign: 'center',
    },

    sosCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 17,
        padding: 16,

        elevation: 2,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },

    sosHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    alertIconContainer: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE4E4',
        borderRadius: 21,
    },

    alertIcon: {
        color: '#D63031',
        fontSize: 23,
        fontWeight: '800',
    },

    sosHeaderText: {
        flex: 1,
        marginLeft: 11,
    },

    sosTitle: {
        color: '#000000',
        fontSize: 17,
        fontWeight: '700',
    },

    sosStatus: {
        color: '#888888',
        fontSize: 12,
        marginTop: 2,
    },

    resolvedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EAF8EE',
        borderRadius: 12,
        paddingHorizontal: 9,
        paddingVertical: 6,
    },

    resolvedDot: {
        width: 6,
        height: 6,
        backgroundColor: '#38A859',
        borderRadius: 3,
        marginRight: 5,
    },

    resolvedText: {
        color: '#278442',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
    },

    sosInformation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        marginTop: 15,
        padding: 12,
    },

    sosInformationItem: {
        flex: 1,
    },

    sosInformationLabel: {
        color: '#999999',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.7,
    },

    sosInformationValue: {
        color: '#111111',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4,
    },

    sosLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
    },

    locationPin: {
        color: '#D63031',
        fontSize: 12,
        marginRight: 7,
    },

    sosLocationText: {
        flex: 1,
        color: '#666666',
        fontSize: 13,
    },

    locationList: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 17,
        overflow: 'hidden',
    },

    locationItem: {
        minHeight: 94,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 13,
    },

    locationItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },

    userAvatar: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111111',
        borderRadius: 24,
    },

    userAvatarText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    userInformation: {
        flex: 1,
        marginLeft: 12,
    },

    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    locationUserName: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '700',
    },

    relationship: {
        color: '#888888',
        fontSize: 12,
    },

    currentLocation: {
        color: '#555555',
        fontSize: 12,
        marginTop: 4,
    },

    updatedTime: {
        color: '#AAAAAA',
        fontSize: 10,
        marginTop: 3,
    },

    userStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
    },

    activeStatusDot: {
        width: 7,
        height: 7,
        backgroundColor: '#47B966',
        borderRadius: 4,
        marginRight: 5,
    },

    activeStatusText: {
        color: '#388C4E',
        fontSize: 11,
        fontWeight: '700',
    },
});