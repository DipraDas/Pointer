import React, {
    useEffect,
    useMemo,
    useRef,
} from 'react';

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { WebView } from 'react-native-webview';

import {
    useGetCurrentUserQuery,
    useGetLatestDeviceDataQuery,
} from '../../Redux/Features/Authentication/AuthApi';


// ======================================================
// CREATE MAP HTML
// ======================================================

const createMapHtml = ({
    latitude,
    longitude,
    deviceName,
    serialNumber,
    gpsDate,
    gpsTime,
    emergency,
}) => {

    return `
        <!DOCTYPE html>

        <html>

        <head>

            <meta
                name="viewport"
                content="
                    width=device-width,
                    initial-scale=1.0,
                    maximum-scale=1.0,
                    user-scalable=no
                "
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


                /* =====================================
                   ATTRIBUTION
                ===================================== */

                .leaflet-control-attribution {
                    font-size: 8px;
                    opacity: 0.7;
                    margin-bottom: 75px !important;
                }


                /* =====================================
                   ZOOM BUTTON
                ===================================== */

                .leaflet-top {
                    top: 110px !important;
                }

                .leaflet-right {
                    right: 12px !important;
                }

                .leaflet-control-zoom {
                    border: none !important;

                    border-radius: 12px !important;

                    overflow: hidden;

                    box-shadow:
                        0 3px 12px
                        rgba(0, 0, 0, 0.18) !important;
                }

                .leaflet-control-zoom a {
                    width: 38px !important;
                    height: 38px !important;

                    line-height: 38px !important;

                    font-size: 20px !important;

                    color: #111111 !important;

                    background: #ffffff !important;

                    border-color: #eeeeee !important;
                }


                /* =====================================
                   MARKER
                ===================================== */

                .device-marker-container {
                    background: transparent !important;
                    border: none !important;
                }


                .device-marker {
                    width: 44px;
                    height: 44px;

                    display: flex;

                    justify-content: center;
                    align-items: center;

                    background: #111111;

                    border: 4px solid #ffffff;

                    border-radius: 50%;

                    box-shadow:
                        0 6px 18px
                        rgba(0, 0, 0, 0.30);
                }


                .device-marker-inner {
                    width: 12px;
                    height: 12px;

                    background: ${emergency
            ? '#FF3B30'
            : '#00C875'
        };

                    border-radius: 50%;
                }


                .marker-pointer {
                    width: 0;
                    height: 0;

                    margin-left: 14px;

                    margin-top: -2px;

                    border-left:
                        8px solid transparent;

                    border-right:
                        8px solid transparent;

                    border-top:
                        10px solid #111111;
                }


                /* =====================================
                   POPUP
                ===================================== */

                .leaflet-popup-content-wrapper {

                    border-radius: 16px;

                    box-shadow:
                        0 5px 20px
                        rgba(0, 0, 0, 0.18);

                }


                .leaflet-popup-content {

                    min-width: 180px;

                    margin: 14px;

                    font-family:
                        Arial,
                        sans-serif;

                }


                .popup-name {

                    color: #111111;

                    font-size: 15px;

                    font-weight: 700;

                }


                .popup-serial {

                    color: #999999;

                    font-size: 10px;

                    margin-top: 4px;

                }


                .popup-location {

                    color: #444444;

                    font-size: 11px;

                    line-height: 17px;

                    margin-top: 9px;

                }


                .popup-time {

                    color: #999999;

                    font-size: 10px;

                    margin-top: 7px;

                }


                .popup-status {

                    color: ${emergency
            ? '#D63031'
            : '#00A864'
        };

                    font-size: 10px;

                    font-weight: 700;

                    margin-top: 7px;

                }

            </style>

        </head>


        <body>

            <div id="map"></div>


            <script
                src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            ></script>


            <script>

                const latitude =
                    ${Number(latitude)};

                const longitude =
                    ${Number(longitude)};


                // =====================================
                // CREATE MAP
                // =====================================

                window.map = L.map(
                    'map',
                    {
                        zoomControl: false,

                        attributionControl: true,

                        doubleClickZoom: true,

                        scrollWheelZoom: true,

                        touchZoom: true,
                    }
                ).setView(
                    [
                        latitude,
                        longitude
                    ],

                    17
                );


                // =====================================
                // OPEN STREET MAP
                // =====================================

                L.tileLayer(

                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

                    {

                        maxZoom: 19,

                        minZoom: 3,

                        attribution:
                            '&copy; OpenStreetMap contributors'

                    }

                ).addTo(window.map);


                // =====================================
                // ZOOM CONTROL
                // =====================================

                L.control
                    .zoom({

                        position:
                            'topright'

                    })
                    .addTo(
                        window.map
                    );


                // =====================================
                // CUSTOM DEVICE MARKER
                // =====================================

                const markerIcon =
                    L.divIcon({

                        className:
                            'device-marker-container',

                        html:

                            '<div class="device-marker">' +

                                '<div class="device-marker-inner"></div>' +

                            '</div>' +

                            '<div class="marker-pointer"></div>',

                        iconSize: [
                            52,
                            58
                        ],

                        iconAnchor: [
                            26,
                            56
                        ],

                        popupAnchor: [
                            0,
                            -54
                        ]

                    });


                // =====================================
                // DEVICE MARKER
                // =====================================

                window.deviceMarker =
                    L.marker(

                        [
                            latitude,
                            longitude
                        ],

                        {
                            icon:
                                markerIcon
                        }

                    )
                    .addTo(
                        window.map
                    );


                // =====================================
                // POPUP
                // Only opens when marker is pressed
                // =====================================

                window.deviceMarker.bindPopup(

                    '<div class="popup-name">' +

                        ${JSON.stringify(
            deviceName ||
            'GPS Tracker'
        )} +

                    '</div>' +


                    '<div class="popup-serial">' +

                        'Serial: ' +

                        ${JSON.stringify(
            serialNumber ||
            ''
        )} +

                    '</div>' +


                    '<div class="popup-location">' +

                        'Latitude: ' +

                        latitude.toFixed(6) +

                        '<br>' +

                        'Longitude: ' +

                        longitude.toFixed(6) +

                    '</div>' +


                    '<div class="popup-time">' +

                        'GPS: ' +

                        ${JSON.stringify(
            `${gpsDate || ''} ${gpsTime || ''}`
        )} +

                    '</div>' +


                    '<div class="popup-status">' +

                        ${emergency

            ? JSON.stringify(
                '⚠ EMERGENCY'
            )

            : JSON.stringify(
                '● ACTIVE'
            )
        } +

                    '</div>'

                );


                // IMPORTANT:
                // We are NOT automatically opening the popup.
                // User can tap the marker to open it.


            </script>

        </body>

        </html>
    `;
};



// ======================================================
// MAP SCREEN
// ======================================================

const MapScreen = () => {

    const webViewRef =
        useRef(null);


    // ==================================================
    // GET LOGGED-IN USER FROM REDUX API
    // ==================================================

    const {

        data: userResponse,

        isLoading: isUserLoading,

        error: userError,

    } = useGetCurrentUserQuery();


    const user =
        userResponse?.data ||
        null;


    // ==================================================
    // CONNECTED DEVICE
    // ==================================================

    const device =
        user?.devices?.[0] ||
        null;


    const deviceName =
        device?.deviceName ||
        'GPS Tracker';


    const serialNumber =
        device?.serialNumber ||
        null;


    // ==================================================
    // GET LATEST TRACKER DATA
    // ==================================================

    const {

        data: trackerResponse,

        isLoading: isTrackerLoading,

        error: trackerError,

    } = useGetLatestDeviceDataQuery(

        serialNumber,

        {

            skip:
                !serialNumber,

            pollingInterval:
                5000,

        }

    );


    const tracker =
        trackerResponse?.data ||
        null;

    const lastUpdatedTime = tracker?.updatedAt
        ? new Date(tracker.updatedAt).getTime()
        : 0;

    const currentTime = Date.now();

    const differenceInSeconds =
        (currentTime - lastUpdatedTime) / 1000;
    const isOnline =
        differenceInSeconds >= 0 &&
        differenceInSeconds <= 10;

    // ==================================================
    // LATITUDE
    // ==================================================

    const latitude =
        Number(
            tracker?.latitude
        );


    // ==================================================
    // LONGITUDE
    // ==================================================

    const longitude =
        Number(
            tracker?.longitude
        );


    // ==================================================
    // CHECK LOCATION
    // ==================================================

    const hasLocation =

        Number.isFinite(
            latitude
        )

        &&

        Number.isFinite(
            longitude
        );


    // ==================================================
    // DEVICE FIRST LETTER
    // ==================================================

    const deviceLetter =

        deviceName
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase()

        ||

        'G';


    // ==================================================
    // CREATE MAP
    // ==================================================
const initialLocationRef = useRef(null);

if (
    !initialLocationRef.current &&
    hasLocation
) {
    initialLocationRef.current = {
        latitude,
        longitude,
    };
}

const mapHtml = useMemo(() => {

    if (!initialLocationRef.current) {
        return '';
    }

    return createMapHtml({
        latitude:
            initialLocationRef.current.latitude,

        longitude:
            initialLocationRef.current.longitude,

        deviceName,

        serialNumber,

        gpsDate:
            tracker?.gpsDate,

        gpsTime:
            tracker?.gpsTime,

        emergency:
            tracker?.emergency,
    });

}, [serialNumber]);

useEffect(() => {

    if (
        !hasLocation ||
        !webViewRef.current
    ) {
        return;
    }

    const script = `
        if (
            window.deviceMarker &&
            window.map
        ) {

            const newLat =
                ${Number(latitude)};

            const newLng =
                ${Number(longitude)};

            window.deviceMarker.setLatLng([
                newLat,
                newLng
            ]);

        }

        true;
    `;

    webViewRef.current.injectJavaScript(
        script
    );

}, [
    latitude,
    longitude,
]);

    // ==================================================
    // USER LOADING
    // ==================================================

    if (isUserLoading) {

        return (

            <View style={styles.center}>

                <ActivityIndicator
                    size="large"
                    color="#111111"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading device...
                </Text>

            </View>

        );

    }


    // ==================================================
    // USER ERROR
    // ==================================================

    if (userError) {

        return (

            <View style={styles.center}>

                <Text style={styles.errorTitle}>
                    Unable to load device
                </Text>

                <Text style={styles.errorText}>
                    Failed to get user information.
                </Text>

            </View>

        );

    }


    // ==================================================
    // NO DEVICE
    // ==================================================

    if (!device) {

        return (

            <View style={styles.center}>

                <Text style={styles.errorTitle}>
                    No Device
                </Text>

                <Text style={styles.errorText}>
                    No connected device found.
                </Text>

            </View>

        );

    }


    // ==================================================
    // TRACKER LOADING
    // ==================================================

    if (isTrackerLoading) {

        return (

            <View style={styles.center}>

                <ActivityIndicator
                    size="large"
                    color="#111111"
                />

                <Text style={styles.loadingText}>
                    Loading live location...
                </Text>

            </View>

        );

    }


    // ==================================================
    // TRACKER ERROR
    // ==================================================

    if (trackerError) {

        return (

            <View style={styles.center}>

                <Text style={styles.errorTitle}>
                    Location unavailable
                </Text>

                <Text style={styles.errorText}>
                    Failed to get the latest GPS location.
                </Text>

            </View>

        );

    }


    // ==================================================
    // NO GPS
    // ==================================================

   useEffect(() => {

    if (
        !hasLocation ||
        !webViewRef.current
    ) {
        return;
    }

    const safeDeviceName =
        JSON.stringify(
            deviceName || 'GPS Tracker'
        );

    const safeSerial =
        JSON.stringify(
            serialNumber || ''
        );

    const safeGpsDate =
        JSON.stringify(
            tracker?.gpsDate || ''
        );

    const safeGpsTime =
        JSON.stringify(
            tracker?.gpsTime || ''
        );

    const emergency =
        Boolean(
            tracker?.emergency
        );

    const script = `

        if (
            window.deviceMarker &&
            window.map
        ) {

            const newLat =
                ${Number(latitude)};

            const newLng =
                ${Number(longitude)};

            window.deviceMarker.setLatLng([
                newLat,
                newLng
            ]);


            const popupContent =
                '<div class="popup-name">' +
                    ${safeDeviceName} +
                '</div>' +

                '<div class="popup-serial">' +
                    'Serial: ' +
                    ${safeSerial} +
                '</div>' +

                '<div class="popup-location">' +
                    'Latitude: ' +
                    newLat.toFixed(6) +
                    '<br>' +
                    'Longitude: ' +
                    newLng.toFixed(6) +
                '</div>' +

                '<div class="popup-time">' +
                    'GPS: ' +
                    ${safeGpsDate} +
                    ' ' +
                    ${safeGpsTime} +
                '</div>' +

                '<div class="popup-status">' +
                    ${
                        emergency
                            ? JSON.stringify(
                                '⚠ EMERGENCY'
                            )
                            : JSON.stringify(
                                '● ACTIVE'
                            )
                    } +
                '</div>';


            window.deviceMarker
                .setPopupContent(
                    popupContent
                );
        }

        true;
    `;

    webViewRef.current.injectJavaScript(
        script
    );

}, [
    latitude,
    longitude,
    tracker?.gpsDate,
    tracker?.gpsTime,
    tracker?.emergency,
    deviceName,
    serialNumber,
]);


    // ==================================================
    // SCREEN
    // ==================================================

    return (

        <View style={styles.container}>


            {/* ===================================== */}
            {/* MAP */}
            {/* ===================================== */}

            <WebView

                ref={webViewRef}

                source={{
                    html: mapHtml,
                }}

                style={styles.map}

                originWhitelist={[
                    '*'
                ]}

                javaScriptEnabled={true}

                domStorageEnabled={true}

                mixedContentMode="always"

                showsVerticalScrollIndicator={false}

                showsHorizontalScrollIndicator={false}

                overScrollMode="never"

            />

            {/* ===================================== */}
            {/* BOTTOM DEVICE CARD */}
            {/* ===================================== */}

            <View style={styles.locationCard}>


                {/* ================================= */}
                {/* DEVICE DETAILS */}
                {/* ================================= */}

                <View style={styles.deviceRow}>


                    <View style={styles.deviceIcon}>


                        <Text style={styles.deviceLetter}>

                            {deviceLetter}

                        </Text>


                    </View>


                    <View style={styles.deviceInfo}>


                        <Text style={styles.deviceLabel}>

                            TRACKING DEVICE

                        </Text>


                        <Text
                            style={styles.cardDeviceName}
                            numberOfLines={1}
                        >

                            {deviceName}

                        </Text>


                        <Text style={styles.cardSerial}>

                            {serialNumber}

                        </Text>


                    </View>


                    {/* STATUS */}

                    <View style={styles.cardStatus}>


                        <View
                            style={
                                isOnline
                                    ? styles.cardLiveDot
                                    : styles.cardOfflineDot
                            }
                        />

                        <Text
                            style={
                                isOnline
                                    ? styles.cardLiveText
                                    : styles.cardOfflineText
                            }
                        >
                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </Text>


                    </View>


                </View>


                {/* ================================= */}
                {/* DIVIDER */}
                {/* ================================= */}

                <View style={styles.divider} />


                {/* ================================= */}
                {/* COORDINATES */}
                {/* ================================= */}

                <View style={styles.coordinatesRow}>


                    {/* LATITUDE */}

                    <View style={styles.coordinateBox}>


                        <Text style={styles.coordinateLabel}>

                            LATITUDE

                        </Text>


                        <Text style={styles.coordinateValue}>

                            {latitude.toFixed(6)}

                        </Text>


                    </View>


                    <View style={styles.verticalDivider} />


                    {/* LONGITUDE */}

                    <View style={styles.coordinateBox}>


                        <Text style={styles.coordinateLabel}>

                            LONGITUDE

                        </Text>


                        <Text style={styles.coordinateValue}>

                            {longitude.toFixed(6)}

                        </Text>


                    </View>


                </View>


                {/* ================================= */}
                {/* GPS UPDATE */}
                {/* ================================= */}

                <View style={styles.updateRow}>


                    <View

                        style={

                            tracker?.emergency

                                ? styles.updateEmergencyDot

                                : styles.updateLiveDot

                        }

                    />


                    <Text style={styles.updatedText}>

                        GPS updated{' '}

                        {tracker?.gpsDate}{' '}

                        {tracker?.gpsTime}

                    </Text>


                </View>


            </View>


        </View>

    );

};


export default MapScreen;


// ======================================================
// STYLES
// ======================================================

const styles =
    StyleSheet.create({


        // ==========================================
        // MAIN
        // ==========================================

        container: {

            flex: 1,

            backgroundColor: '#FFFFFF',

        },


        map: {

            flex: 1,

            backgroundColor: '#EEEEEE',

        },


        center: {

            flex: 1,

            justifyContent: 'center',

            alignItems: 'center',

            backgroundColor: '#FFFFFF',

            paddingHorizontal: 30,

        },


        loadingText: {

            color: '#777777',

            fontSize: 14,

            marginTop: 12,

        },


        errorTitle: {

            color: '#111111',

            fontSize: 20,

            fontWeight: '800',

        },


        errorText: {

            color: '#888888',

            fontSize: 13,

            marginTop: 7,

            textAlign: 'center',

        },


        // ==========================================
        // TOP HEADER
        // ==========================================

        header: {

            position: 'absolute',

            top: 20,

            left: 18,

            right: 18,

            minHeight: 78,

            flexDirection: 'row',

            justifyContent: 'space-between',

            alignItems: 'center',

            backgroundColor: '#FFFFFF',

            borderRadius: 22,

            paddingHorizontal: 18,

            paddingVertical: 14,

            elevation: 10,

            shadowColor: '#000000',

            shadowOffset: {

                width: 0,

                height: 4,

            },

            shadowOpacity: 0.14,

            shadowRadius: 10,

        },


        headerLeft: {

            flex: 1,

            marginRight: 12,

        },


        deviceName: {

            color: '#111111',

            fontSize: 20,

            fontWeight: '800',

        },


        serialNumber: {

            color: '#999999',

            fontSize: 11,

            marginTop: 4,

            letterSpacing: 0.3,

        },


        // ==========================================
        // LIVE BADGE
        // ==========================================

        liveBadge: {

            flexDirection: 'row',

            alignItems: 'center',

            backgroundColor: '#111111',

            borderRadius: 20,

            paddingHorizontal: 13,

            paddingVertical: 9,

        },


        sosBadge: {

            flexDirection: 'row',

            alignItems: 'center',

            backgroundColor: '#D63031',

            borderRadius: 20,

            paddingHorizontal: 13,

            paddingVertical: 9,

        },


        liveDot: {

            width: 8,

            height: 8,

            backgroundColor: '#00C875',

            borderRadius: 4,

            marginRight: 7,

        },


        emergencyDot: {

            width: 8,

            height: 8,

            backgroundColor: '#FFFFFF',

            borderRadius: 4,

            marginRight: 7,

        },


        liveText: {

            color: '#FFFFFF',

            fontSize: 11,

            fontWeight: '800',

            letterSpacing: 1,

        },


        // ==========================================
        // BOTTOM CARD
        // ==========================================

        locationCard: {

            position: 'absolute',

            left: 18,

            right: 18,

            bottom: 92,

            backgroundColor: '#FFFFFF',

            borderRadius: 24,

            paddingHorizontal: 18,

            paddingVertical: 17,

            elevation: 12,

            shadowColor: '#000000',

            shadowOffset: {

                width: 0,

                height: 5,

            },

            shadowOpacity: 0.16,

            shadowRadius: 12,

        },


        // ==========================================
        // DEVICE ROW
        // ==========================================

        deviceRow: {

            flexDirection: 'row',

            alignItems: 'center',

        },


        deviceIcon: {

            width: 50,

            height: 50,

            borderRadius: 25,

            backgroundColor: '#111111',

            justifyContent: 'center',

            alignItems: 'center',

            marginRight: 13,

        },


        deviceLetter: {

            color: '#FFFFFF',

            fontSize: 21,

            fontWeight: '900',

        },


        deviceInfo: {

            flex: 1,

        },


        deviceLabel: {

            color: '#AAAAAA',

            fontSize: 8,

            fontWeight: '800',

            letterSpacing: 1.5,

        },


        cardDeviceName: {

            color: '#111111',

            fontSize: 18,

            fontWeight: '800',

            marginTop: 3,

        },


        cardSerial: {

            color: '#999999',

            fontSize: 10,

            marginTop: 3,

        },


        // ==========================================
        // CARD STATUS
        // ==========================================

        cardStatus: {

            flexDirection: 'row',

            alignItems: 'center',

            marginLeft: 8,

        },


        cardLiveDot: {

            width: 6,

            height: 6,

            borderRadius: 3,

            backgroundColor: '#00C875',

            marginRight: 5,

        },


        cardEmergencyDot: {

            width: 6,

            height: 6,

            borderRadius: 3,

            backgroundColor: '#D63031',

            marginRight: 5,

        },


        cardLiveText: {

            color: '#00A864',

            fontSize: 8,

            fontWeight: '800',

            letterSpacing: 0.5,

        },


        cardEmergencyText: {

            color: '#D63031',

            fontSize: 8,

            fontWeight: '800',

            letterSpacing: 0.5,

        },


        // ==========================================
        // DIVIDER
        // ==========================================

        divider: {

            height: 1,

            backgroundColor: '#EEEEEE',

            marginVertical: 15,

        },


        // ==========================================
        // COORDINATES
        // ==========================================

        coordinatesRow: {

            flexDirection: 'row',

            alignItems: 'center',

        },


        coordinateBox: {

            flex: 1,

        },


        verticalDivider: {

            width: 1,

            height: 43,

            backgroundColor: '#EEEEEE',

            marginHorizontal: 16,

        },


        coordinateLabel: {

            color: '#AAAAAA',

            fontSize: 8,

            fontWeight: '800',

            letterSpacing: 1,

        },


        coordinateValue: {

            color: '#111111',

            fontSize: 16,

            fontWeight: '800',

            marginTop: 5,

        },


        // ==========================================
        // UPDATE
        // ==========================================

        updateRow: {

            flexDirection: 'row',

            alignItems: 'center',

            marginTop: 15,

            paddingTop: 12,

            borderTopWidth: 1,

            borderTopColor: '#EEEEEE',

        },


        updateLiveDot: {

            width: 7,

            height: 7,

            borderRadius: 4,

            backgroundColor: '#00C875',

            marginRight: 7,

        },


        updateEmergencyDot: {

            width: 7,

            height: 7,

            borderRadius: 4,

            backgroundColor: '#D63031',

            marginRight: 7,

        },


        updatedText: {

            flex: 1,

            color: '#777777',

            fontSize: 10,

        },
        cardLiveDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#00C875',
            marginRight: 5,
        },

        cardLiveText: {
            color: '#00A864',
            fontSize: 8,
            fontWeight: '800',
            letterSpacing: 0.5,
        },

        cardOfflineDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#FF3B30',
            marginRight: 5,
        },

        cardOfflineText: {
            color: '#FF3B30',
            fontSize: 8,
            fontWeight: '800',
            letterSpacing: 0.5,
        },

    });