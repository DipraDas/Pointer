import React, {
    useRef,
    useState,
} from 'react';

import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { WebView } from 'react-native-webview';

const DEMO_USERS = [
    {
        id: '1',
        name: 'John Pyn',
        relationship: 'Son',
        initials: 'JP',
        latitude: -33.7507,
        longitude: 150.6877,
        location: 'Penrith Station, NSW',
        updatedAt: 'Updated just now',
        status: 'Active',
    },
    {
        id: '2',
        name: 'Sarah Das',
        relationship: 'Sister',
        initials: 'SD',
        latitude: -33.7519,
        longitude: 150.6942,
        location: 'Westfield Penrith, NSW',
        updatedAt: 'Updated 2 minutes ago',
        status: 'Active',
    },
    {
        id: '3',
        name: 'Michael Das',
        relationship: 'Father',
        initials: 'MD',
        latitude: -33.7652,
        longitude: 150.7194,
        location: 'Kingswood, NSW',
        updatedAt: 'Updated 5 minutes ago',
        status: 'Active',
    },
];

const createMapHtml = users => {
    const usersJson = JSON.stringify(users);

    return `
    <!DOCTYPE html>

    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,
          maximum-scale=1.0, user-scalable=no"
        />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <style>
          html,
          body,
          #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: #eeeeee;
          }

          .leaflet-control-attribution {
            font-size: 9px;
            margin-bottom: 78px !important;
          }

          .custom-marker-container {
            background: transparent;
            border: none;
          }

          .custom-marker {
            width: 46px;
            height: 46px;

            display: flex;
            justify-content: center;
            align-items: center;

            background: #111111;
            color: #ffffff;

            border: 4px solid #ffffff;
            border-radius: 50%;

            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: 700;

            box-shadow: 0 4px 10px
              rgba(0, 0, 0, 0.35);
          }

          .marker-pointer {
            width: 0;
            height: 0;

            margin-left: 15px;
            margin-top: -2px;

            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 11px solid #111111;
          }

          .leaflet-popup-content-wrapper {
            border-radius: 14px;
          }

          .leaflet-popup-content {
            min-width: 150px;
            margin: 13px;
            font-family: Arial, sans-serif;
          }

          .popup-name {
            color: #111111;
            font-size: 14px;
            font-weight: 700;
          }

          .popup-location {
            color: #666666;
            font-size: 11px;
            margin-top: 5px;
          }

          .popup-status {
            color: #32914d;
            font-size: 10px;
            font-weight: 700;
            margin-top: 6px;
          }
        </style>
      </head>

      <body>
        <div id="map"></div>

        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        ></script>

        <script>
          const users = ${usersJson};

          window.map = L.map(
            'map',
            {
              zoomControl: false,
              attributionControl: true
            }
          ).setView(
            [-33.7507, 150.6877],
            13
          );

          L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              maxZoom: 19,
              attribution:
                '&copy; OpenStreetMap contributors'
            }
          ).addTo(window.map);

          L.control
            .zoom({
              position: 'bottomright'
            })
            .addTo(window.map);

          const markerGroup =
            L.featureGroup().addTo(window.map);

          users.forEach(user => {
            const markerIcon = L.divIcon({
              className: 'custom-marker-container',

              html:
                '<div class="custom-marker">' +
                user.initials +
                '</div>' +
                '<div class="marker-pointer"></div>',

              iconSize: [54, 62],
              iconAnchor: [27, 60],
              popupAnchor: [0, -58]
            });

            const marker = L.marker(
              [user.latitude, user.longitude],
              {
                icon: markerIcon
              }
            ).addTo(markerGroup);

            marker.bindPopup(
              '<div class="popup-name">' +
                user.name +
                ' (' +
                user.relationship +
                ')' +
              '</div>' +

              '<div class="popup-location">' +
                user.location +
              '</div>' +

              '<div class="popup-status">' +
                '● ' +
                user.status +
                ' • ' +
                user.updatedAt +
              '</div>'
            );

            marker.on('click', () => {
              window.ReactNativeWebView.postMessage(
                JSON.stringify(user)
              );
            });
          });

          if (users.length > 1) {
            window.map.fitBounds(
              markerGroup.getBounds(),
              {
                padding: [60, 60]
              }
            );
          }
        </script>
      </body>
    </html>
  `;
};

const MapScreen = () => {
    const webViewRef = useRef(null);

    const [selectedUser, setSelectedUser] =
        useState(DEMO_USERS[0]);

    const mapHtml = createMapHtml(DEMO_USERS);

    const handleMapMessage = event => {
        try {
            const user = JSON.parse(
                event.nativeEvent.data,
            );

            setSelectedUser(user);
        } catch (error) {
            console.log(
                'Map message error:',
                error,
            );
        }
    };

    const centreSelectedUser = () => {
        if (!selectedUser) {
            return;
        }

        webViewRef.current?.injectJavaScript(`
      window.map.setView(
        [
          ${selectedUser.latitude},
          ${selectedUser.longitude}
        ],
        16,
        {
          animate: true
        }
      );

      true;
    `);
    };

    const showAllUsers = () => {
        webViewRef.current?.injectJavaScript(`
      const coordinates = ${JSON.stringify(
            DEMO_USERS.map(user => [
                user.latitude,
                user.longitude,
            ]),
        )};

      window.map.fitBounds(
        coordinates,
        {
          padding: [60, 60]
        }
      );

      true;
    `);
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <WebView
                ref={webViewRef}
                source={{ html: mapHtml }}
                style={styles.map}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                onMessage={handleMapMessage}
                mixedContentMode="always"
                startInLoadingState
            />

            {/* Header */}

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>
                        LIVE MAP
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Family location updates
                    </Text>
                </View>

                <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />

                    <Text style={styles.liveText}>
                        LIVE
                    </Text>
                </View>
            </View>

            {/* Online counter */}

            <View style={styles.onlineCounter}>
                <View style={styles.onlineCounterDot} />

                <Text style={styles.onlineCounterText}>
                    {DEMO_USERS.length} people online
                </Text>
            </View>

            {/* Show all button */}

            <TouchableOpacity
                style={styles.showAllButton}
                onPress={showAllUsers}
                activeOpacity={0.75}
            >
                <Text style={styles.showAllIcon}>⌖</Text>
            </TouchableOpacity>

            {/* Selected user card */}

            {selectedUser && (
                <View style={styles.userCard}>
                    <View style={styles.cardHandle} />

                    <View style={styles.userHeader}>
                        <View style={styles.userAvatar}>
                            <Text style={styles.userAvatarText}>
                                {selectedUser.initials}
                            </Text>
                        </View>

                        <View style={styles.userDetails}>
                            <View style={styles.userNameRow}>
                                <Text style={styles.userName}>
                                    {selectedUser.name}
                                </Text>

                                <Text style={styles.relationship}>
                                    {' '}
                                    ({selectedUser.relationship})
                                </Text>
                            </View>

                            <View style={styles.statusRow}>
                                <View style={styles.activeDot} />

                                <Text style={styles.activeText}>
                                    {selectedUser.status}
                                </Text>

                                <Text style={styles.statusDivider}>
                                    •
                                </Text>

                                <Text style={styles.updatedText}>
                                    {selectedUser.updatedAt}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedUser(null)}
                        >
                            <Text style={styles.closeButtonText}>
                                ×
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.locationContainer}>
                        <View style={styles.locationIcon}>
                            <Text style={styles.locationIconText}>
                                ●
                            </Text>
                        </View>

                        <View style={styles.locationDetails}>
                            <Text style={styles.locationLabel}>
                                CURRENT LOCATION
                            </Text>

                            <Text
                                style={styles.locationText}
                                numberOfLines={1}
                            >
                                {selectedUser.location}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.centreButton}
                        onPress={centreSelectedUser}
                        activeOpacity={0.75}
                    >
                        <Text style={styles.centreButtonText}>
                            CENTRE ON MAP
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    map: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },

    header: {
        position: 'absolute',
        top: 20,
        left: 18,
        right: 18,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingHorizontal: 17,
        paddingVertical: 14,

        elevation: 8,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },

    headerTitle: {
        color: '#000000',
        fontSize: 20,
        fontFamily: 'Quantico-Bold',
        letterSpacing: 4,
    },

    headerSubtitle: {
        color: '#888888',
        fontSize: 12,
        marginTop: 2,
    },

    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111111',
        borderRadius: 15,
        paddingHorizontal: 11,
        paddingVertical: 7,
    },

    liveDot: {
        width: 7,
        height: 7,
        backgroundColor: '#4ECB71',
        borderRadius: 4,
        marginRight: 6,
    },

    liveText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },

    onlineCounter: {
        position: 'absolute',
        top: 112,
        left: 18,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 8,

        elevation: 6,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },

    onlineCounterDot: {
        width: 7,
        height: 7,
        backgroundColor: '#4ECB71',
        borderRadius: 4,
        marginRight: 7,
    },

    onlineCounterText: {
        color: '#222222',
        fontSize: 11,
        fontWeight: '700',
    },

    showAllButton: {
        position: 'absolute',
        right: 18,
        bottom: 250,

        width: 48,
        height: 48,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#FFFFFF',
        borderRadius: 16,

        elevation: 8,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 6,
    },

    showAllIcon: {
        color: '#000000',
        fontSize: 26,
        fontWeight: '700',
    },

    userCard: {
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 95,

        backgroundColor: '#FFFFFF',
        borderRadius: 21,
        padding: 17,

        elevation: 12,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.22,
        shadowRadius: 10,
    },

    cardHandle: {
        width: 34,
        height: 4,
        alignSelf: 'center',
        backgroundColor: '#DDDDDD',
        borderRadius: 2,
        marginBottom: 14,
    },

    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: 14,
        fontWeight: '700',
    },

    userDetails: {
        flex: 1,
        marginLeft: 12,
    },

    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    userName: {
        color: '#000000',
        fontSize: 17,
        fontWeight: '700',
    },

    relationship: {
        color: '#888888',
        fontSize: 12,
    },

    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },

    activeDot: {
        width: 7,
        height: 7,
        backgroundColor: '#4ECB71',
        borderRadius: 4,
        marginRight: 5,
    },

    activeText: {
        color: '#399150',
        fontSize: 11,
        fontWeight: '700',
    },

    statusDivider: {
        color: '#BBBBBB',
        fontSize: 11,
        marginHorizontal: 6,
    },

    updatedText: {
        color: '#999999',
        fontSize: 10,
    },

    closeButton: {
        width: 32,
        height: 32,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#F0F0F0',
        borderRadius: 16,
    },

    closeButtonText: {
        color: '#555555',
        fontSize: 22,
        lineHeight: 24,
    },

    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#F5F5F5',
        borderRadius: 13,

        marginTop: 15,
        padding: 12,
    },

    locationIcon: {
        width: 34,
        height: 34,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#E4E4E4',
        borderRadius: 17,
    },

    locationIconText: {
        color: '#111111',
        fontSize: 11,
    },

    locationDetails: {
        flex: 1,
        marginLeft: 10,
    },

    locationLabel: {
        color: '#999999',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
    },

    locationText: {
        color: '#222222',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 3,
    },

    centreButton: {
        width: '100%',
        backgroundColor: '#111111',
        borderRadius: 12,
        marginTop: 13,
        paddingVertical: 13,
    },

    centreButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
});