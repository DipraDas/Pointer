import React, { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useGetAllDevicesQuery, useAddDeviceToUserMutation } from '../../Redux/Features/Authentication/AuthApi';

const HomeScreen = () => {

    const navigation = useNavigation();

    // Logged-in user from Redux
    const reduxUser = useSelector(state => state.auth?.user);
    const [loggedInUser, setLoggedInUser] = useState(reduxUser || null);
    const [myDevices, setMyDevices] = useState(reduxUser?.devices || []);
    const [isLoading, setIsLoading] = useState(true);
    const [deviceModalVisible, setDeviceModalVisible] = useState(false);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    // Get every available device
    const { data: deviceResponse, isLoading: isDevicesLoading, refetch: refetchDevices } = useGetAllDevicesQuery();
    const [addDeviceToUser, { isLoading: isAddingDevice, },] = useAddDeviceToUserMutation();

    const availableDevices = deviceResponse?.data || deviceResponse?.devices || [];

    useEffect(() => {

        const getUserInformation = async () => {

            try {

                // Redux user is preferred
                if (reduxUser) {

                    setLoggedInUser(reduxUser);

                    setMyDevices(
                        reduxUser?.devices || []
                    );

                    return;
                }


                // Fallback to AsyncStorage
                const savedUser =
                    await AsyncStorage.getItem('user');

                if (savedUser) {

                    const parsedUser =
                        JSON.parse(savedUser);

                    setLoggedInUser(parsedUser);

                    setMyDevices(
                        parsedUser?.devices || []
                    );
                }

            } catch (error) {

                console.log(
                    'Error getting user:',
                    error
                );

            } finally {

                setIsLoading(false);

            }
        };


        getUserInformation();

    }, [reduxUser]);

    const username = loggedInUser?.name || loggedInUser?.username || 'User';

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

    const handleAddDevice = async () => {

        if (!selectedDeviceId) {

            Alert.alert(
                'Select Device',
                'Please select a device first.'
            );

            return;
        }


        try {

            const response =
                await addDeviceToUser(
                    selectedDeviceId
                ).unwrap();


            console.log(
                'Device added:',
                response
            );


            // Find selected device
            const selectedDevice =
                availableDevices.find(
                    device =>
                        (device._id || device.id) ===
                        selectedDeviceId
                );


            if (selectedDevice) {

                setMyDevices(previous => {

                    const alreadyExists =
                        previous.some(
                            item =>
                                (
                                    item._id ||
                                    item.id
                                ) ===
                                selectedDeviceId
                        );


                    if (alreadyExists) {
                        return previous;
                    }


                    return [
                        ...previous,
                        selectedDevice,
                    ];
                });
            }


            setSelectedDeviceId(null);

            setDeviceModalVisible(false);


            Alert.alert(
                'Device Added',
                response?.message ||
                'Device added successfully.'
            );


            refetchDevices();

        } catch (error) {

            console.log(
                'Add device error:',
                error
            );


            Alert.alert(
                'Unable to Add Device',
                error?.data?.message ||
                'Failed to add device.'
            );

        }
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

                {/* Add device */}
                <View style={styles.deviceHeader}>

                    <View>

                        <Text style={styles.deviceSectionTitle}>
                            My Devices
                        </Text>

                        <Text style={styles.deviceSectionSubtitle}>
                            {myDevices.length}
                            {myDevices.length === 1
                                ? ' device connected'
                                : ' devices connected'}
                        </Text>

                    </View>


                    <TouchableOpacity
                        style={styles.addDeviceButton}
                        activeOpacity={0.8}
                        onPress={() => {

                            setSelectedDeviceId(null);

                            setDeviceModalVisible(true);

                            refetchDevices();
                        }}
                    >

                        <Text style={styles.addDevicePlus}>
                            +
                        </Text>

                        <Text style={styles.addDeviceButtonText}>
                            ADD DEVICE
                        </Text>

                    </TouchableOpacity>

                </View>

                {myDevices.length === 0 ? (

                    <View style={styles.noDeviceCard}>

                        <View style={styles.noDeviceIcon}>

                            <Text style={styles.noDeviceIconText}>
                                ⦿
                            </Text>

                        </View>


                        <View style={styles.noDeviceInformation}>

                            <Text style={styles.noDeviceTitle}>
                                No device connected
                            </Text>

                            <Text style={styles.noDeviceSubtitle}>
                                Add a tracking device to get started
                            </Text>

                        </View>

                    </View>

                ) : (

                    <View style={styles.deviceList}>

                        {myDevices.map((device, index) => {

                            const deviceId =
                                device._id ||
                                device.id;

                            const deviceName =
                                device.name ||
                                device.deviceName ||
                                device.deviceId ||
                                'Tracking Device';


                            return (

                                <TouchableOpacity
                                    key={deviceId || index}
                                    style={[
                                        styles.myDeviceItem,

                                        index !==
                                        myDevices.length - 1 &&
                                        styles.myDeviceBorder,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() =>
                                        navigation.navigate(
                                            'Map',
                                            {
                                                device,
                                            }
                                        )
                                    }
                                >

                                    <View style={styles.deviceCircle}>

                                        <Text
                                            style={
                                                styles.deviceCircleText
                                            }
                                        >
                                            ⦿
                                        </Text>

                                    </View>


                                    <View
                                        style={
                                            styles.deviceInformation
                                        }
                                    >

                                        <Text style={styles.deviceName}>
                                            {deviceName}
                                        </Text>

                                        <Text
                                            style={
                                                styles.deviceIdText
                                            }
                                        >
                                            {device.deviceCode ||
                                                device.serialNumber ||
                                                device.deviceId ||
                                                'Connected device'}
                                        </Text>

                                    </View>


                                    <View
                                        style={
                                            styles.connectedStatus
                                        }
                                    >

                                        <View
                                            style={
                                                styles.connectedDot
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.connectedText
                                            }
                                        >
                                            ADDED
                                        </Text>

                                    </View>

                                </TouchableOpacity>
                            );
                        })}

                    </View>
                )}

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

            <Modal
                visible={deviceModalVisible}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() =>
                    setDeviceModalVisible(false)
                }
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>


                        {/* MODAL HEADER */}

                        <View style={styles.modalHeader}>

                            <View>

                                <Text style={styles.modalTitle}>
                                    ADD DEVICE
                                </Text>

                                <Text style={styles.modalSubtitle}>
                                    Select an available device
                                </Text>

                            </View>


                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() =>
                                    setDeviceModalVisible(false)
                                }
                            >

                                <Text style={styles.closeButtonText}>
                                    ×
                                </Text>

                            </TouchableOpacity>

                        </View>


                        <View style={styles.modalDivider} />


                        {/* DEVICE LIST */}

                        {isDevicesLoading ? (

                            <View style={styles.modalLoading}>

                                <ActivityIndicator
                                    size="large"
                                    color="#000000"
                                />

                                <Text
                                    style={
                                        styles.loadingDeviceText
                                    }
                                >
                                    Finding available devices...
                                </Text>

                            </View>

                        ) : availableDevices.length === 0 ? (

                            <View style={styles.emptyDevices}>

                                <View
                                    style={
                                        styles.emptyDeviceCircle
                                    }
                                >

                                    <Text
                                        style={
                                            styles.emptyDeviceIcon
                                        }
                                    >
                                        ⦿
                                    </Text>

                                </View>

                                <Text style={styles.emptyDeviceTitle}>
                                    No devices available
                                </Text>

                                <Text
                                    style={
                                        styles.emptyDeviceSubtitle
                                    }
                                >
                                    There are currently no devices
                                    available to add.
                                </Text>

                            </View>

                        ) : (

                            <ScrollView
                                style={styles.availableDeviceList}
                                showsVerticalScrollIndicator={false}
                            >

                                {availableDevices.map(
                                    (device, index) => {

                                        const deviceId =
                                            device._id ||
                                            device.id;

                                        const isSelected =
                                            selectedDeviceId ===
                                            deviceId;


                                        const alreadyAdded =
                                            myDevices.some(
                                                item =>
                                                    (
                                                        item._id ||
                                                        item.id
                                                    ) ===
                                                    deviceId
                                            );


                                        return (

                                            <TouchableOpacity
                                                key={
                                                    deviceId ||
                                                    index
                                                }
                                                style={[
                                                    styles.availableDevice,

                                                    isSelected &&
                                                    styles.selectedDevice,

                                                    alreadyAdded &&
                                                    styles.alreadyAddedDevice,
                                                ]}
                                                disabled={
                                                    alreadyAdded
                                                }
                                                activeOpacity={0.75}
                                                onPress={() =>
                                                    setSelectedDeviceId(
                                                        deviceId
                                                    )
                                                }
                                            >

                                                <View
                                                    style={[
                                                        styles.availableDeviceIcon,

                                                        isSelected &&
                                                        styles.selectedDeviceIcon,
                                                    ]}
                                                >

                                                    <Text
                                                        style={[
                                                            styles.availableDeviceIconText,

                                                            isSelected &&
                                                            styles.selectedDeviceIconText,
                                                        ]}
                                                    >
                                                        ⦿
                                                    </Text>

                                                </View>


                                                <View
                                                    style={
                                                        styles.availableDeviceInfo
                                                    }
                                                >

                                                    <Text
                                                        style={
                                                            styles.availableDeviceName
                                                        }
                                                    >
                                                        {device.name ||
                                                            device.deviceName ||
                                                            'Tracking Device'}
                                                    </Text>


                                                    <Text
                                                        style={
                                                            styles.availableDeviceCode
                                                        }
                                                    >
                                                        {device.deviceCode ||
                                                            device.serialNumber ||
                                                            device.deviceId ||
                                                            deviceId}
                                                    </Text>

                                                </View>


                                                {alreadyAdded ? (

                                                    <View
                                                        style={
                                                            styles.addedBadge
                                                        }
                                                    >

                                                        <Text
                                                            style={
                                                                styles.addedBadgeText
                                                            }
                                                        >
                                                            ADDED
                                                        </Text>

                                                    </View>

                                                ) : (

                                                    <View
                                                        style={[
                                                            styles.radioOuter,

                                                            isSelected &&
                                                            styles.radioOuterSelected,
                                                        ]}
                                                    >

                                                        {isSelected && (
                                                            <View
                                                                style={
                                                                    styles.radioInner
                                                                }
                                                            />
                                                        )}

                                                    </View>

                                                )}

                                            </TouchableOpacity>
                                        );
                                    }
                                )}

                            </ScrollView>
                        )}


                        {/* BUTTON */}

                        <TouchableOpacity
                            style={[
                                styles.confirmAddButton,

                                (!selectedDeviceId ||
                                    isAddingDevice) &&
                                styles.disabledAddButton,
                            ]}
                            disabled={
                                !selectedDeviceId ||
                                isAddingDevice
                            }
                            onPress={handleAddDevice}
                        >

                            {isAddingDevice ? (

                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />

                            ) : (

                                <Text
                                    style={
                                        styles.confirmAddButtonText
                                    }
                                >
                                    ADD SELECTED DEVICE
                                </Text>

                            )}

                        </TouchableOpacity>


                        <TouchableOpacity
                            style={styles.cancelModalButton}
                            onPress={() =>
                                setDeviceModalVisible(false)
                            }
                            disabled={isAddingDevice}
                        >

                            <Text
                                style={
                                    styles.cancelModalText
                                }
                            >
                                CANCEL
                            </Text>

                        </TouchableOpacity>


                    </View>

                </View>

            </Modal>
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

    deviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 27,
        marginBottom: 12,
    },

    deviceSectionTitle: {
        color: '#000000',
        fontSize: 19,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    deviceSectionSubtitle: {
        color: '#999999',
        fontSize: 11,
        marginTop: 3,
    },

    addDeviceButton: {
        height: 38,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111111',
        paddingHorizontal: 13,
        borderRadius: 11,
    },

    addDevicePlus: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: '400',
        marginRight: 6,
    },

    addDeviceButtonText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
    },


    /* MY DEVICES */

    deviceList: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 17,
        overflow: 'hidden',
    },

    myDeviceItem: {
        minHeight: 76,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    myDeviceBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },

    deviceCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111111',
    },

    deviceCircleText: {
        color: '#FFFFFF',
        fontSize: 20,
    },

    deviceInformation: {
        flex: 1,
        marginLeft: 12,
    },

    deviceName: {
        color: '#111111',
        fontSize: 15,
        fontWeight: '700',
    },

    deviceIdText: {
        color: '#999999',
        fontSize: 11,
        marginTop: 4,
    },

    connectedStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    connectedDot: {
        width: 6,
        height: 6,
        backgroundColor: '#47B966',
        borderRadius: 3,
        marginRight: 5,
    },

    connectedText: {
        color: '#388C4E',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.6,
    },


    /* NO DEVICE */

    noDeviceCard: {
        minHeight: 82,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 17,
        paddingHorizontal: 15,
    },

    noDeviceIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
    },

    noDeviceIconText: {
        color: '#777777',
        fontSize: 20,
    },

    noDeviceInformation: {
        marginLeft: 12,
        flex: 1,
    },

    noDeviceTitle: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '700',
    },

    noDeviceSubtitle: {
        color: '#999999',
        fontSize: 11,
        marginTop: 3,
    },


    /* MODAL */

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        paddingHorizontal: 18,
    },

    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 20,
        maxHeight: '80%',
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    modalTitle: {
        color: '#111111',
        fontSize: 20,
        fontFamily: 'Quantico-Bold',
        letterSpacing: 2,
    },

    modalSubtitle: {
        color: '#999999',
        fontSize: 12,
        marginTop: 4,
    },

    closeButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F2F2',
    },

    closeButtonText: {
        color: '#111111',
        fontSize: 25,
        lineHeight: 27,
    },

    modalDivider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginTop: 17,
        marginBottom: 13,
    },

    availableDeviceList: {
        maxHeight: 330,
    },

    availableDevice: {
        minHeight: 72,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 11,
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 14,
        marginBottom: 9,
    },

    selectedDevice: {
        backgroundColor: '#111111',
        borderColor: '#111111',
    },

    alreadyAddedDevice: {
        opacity: 0.5,
    },

    availableDeviceIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
    },

    selectedDeviceIcon: {
        backgroundColor: '#FFFFFF',
    },

    availableDeviceIconText: {
        color: '#111111',
        fontSize: 18,
    },

    selectedDeviceIconText: {
        color: '#111111',
    },

    availableDeviceInfo: {
        flex: 1,
        marginLeft: 11,
    },

    availableDeviceName: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '700',
    },

    availableDeviceCode: {
        color: '#999999',
        fontSize: 10,
        marginTop: 3,
    },

    radioOuter: {
        width: 21,
        height: 21,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: '#BBBBBB',
        alignItems: 'center',
        justifyContent: 'center',
    },

    radioOuterSelected: {
        borderColor: '#FFFFFF',
    },

    radioInner: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },

    addedBadge: {
        backgroundColor: '#EAF8EE',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 10,
    },

    addedBadgeText: {
        color: '#278442',
        fontSize: 9,
        fontWeight: '700',
    },

    confirmAddButton: {
        height: 52,
        backgroundColor: '#111111',
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },

    disabledAddButton: {
        opacity: 0.4,
    },

    confirmAddButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.3,
    },

    cancelModalButton: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },

    cancelModalText: {
        color: '#777777',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },

    modalLoading: {
        alignItems: 'center',
        paddingVertical: 45,
    },

    loadingDeviceText: {
        color: '#777777',
        fontSize: 12,
        marginTop: 12,
    },

    emptyDevices: {
        alignItems: 'center',
        paddingVertical: 30,
    },

    emptyDeviceCircle: {
        width: 55,
        height: 55,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
    },

    emptyDeviceIcon: {
        color: '#777777',
        fontSize: 23,
    },

    emptyDeviceTitle: {
        color: '#111111',
        fontSize: 15,
        fontWeight: '700',
        marginTop: 12,
    },

    emptyDeviceSubtitle: {
        color: '#999999',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 5,
    },
});