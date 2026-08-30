import {
  getApp,
  getApps,
} from '@react-native-firebase/app';

import {
  getMessaging,
  getToken,
  onMessage,
} from '@react-native-firebase/messaging';

import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';


// ==========================================
// REQUEST NOTIFICATION PERMISSION
// ==========================================

export const requestNotificationPermission = async () => {
  try {
    console.log(
      'Requesting Android notification permission...'
    );

    const settings =
      await notifee.requestPermission();

    console.log(
      'Notifee permission settings:',
      settings
    );

    if (
      settings.authorizationStatus ===
        AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus ===
        AuthorizationStatus.PROVISIONAL
    ) {
      console.log(
        'Notification permission granted'
      );

      return true;
    }

    console.log(
      'Notification permission NOT granted'
    );

    return false;

  } catch (error) {

    console.log(
      'Notification permission error:',
      error
    );

    return false;
  }
};


// ==========================================
// CREATE ANDROID CHANNEL
// ==========================================

export const createNotificationChannel = async () => {
  try {

    const channelId =
      await notifee.createChannel({
        id: 'default',
        name: 'Default Notifications',
        importance: AndroidImportance.HIGH,
      });

    console.log(
      'Notification channel created:',
      channelId
    );

    return channelId;

  } catch (error) {

    console.log(
      'Notification channel error:',
      error
    );

    return null;
  }
};


// ==========================================
// FCM SETUP
// ==========================================

export const setupFCM = async () => {
  try {

    console.log(
      '========== FIREBASE TEST =========='
    );

    const apps = getApps();

    console.log(
      'Firebase apps count:',
      apps.length
    );

    const app = getApp();

    console.log(
      'Firebase app:',
      app
    );

    const messaging = getMessaging(app);

    console.log(
      'Messaging instance:',
      messaging
    );

    const token = await getToken(messaging);

    console.log(
      '==================================='
    );

    console.log(
      'FCM TOKEN:',
      token
    );

    console.log(
      '==================================='
    );

    return token;

  } catch (error) {

    console.log(
      '==================================='
    );

    console.log(
      'FCM ERROR:',
      error
    );

    console.log(
      'FCM ERROR MESSAGE:',
      error?.message
    );

    console.log(
      'FCM ERROR CODE:',
      error?.code
    );

    console.log(
      '==================================='
    );

    return null;
  }
};


// ==========================================
// FOREGROUND MESSAGE LISTENER
// ==========================================

export const listenForForegroundNotifications = () => {

  try {

    const app = getApp();

    const messaging = getMessaging(app);

    const unsubscribe = onMessage(
      messaging,
      async remoteMessage => {

        console.log(
          '========== FCM FOREGROUND MESSAGE =========='
        );

        console.log(
          'Full message:',
          remoteMessage
        );

        const title =
          remoteMessage?.notification?.title ||
          remoteMessage?.data?.title ||
          'Notification';

        const body =
          remoteMessage?.notification?.body ||
          remoteMessage?.data?.body ||
          '';

        console.log(
          'Title:',
          title
        );

        console.log(
          'Body:',
          body
        );

        try {

          await notifee.displayNotification({
            title,
            body,

            android: {
              channelId: 'default',

              smallIcon: 'ic_launcher',

              pressAction: {
                id: 'default',
              },
            },
          });

          console.log(
            'Notifee notification displayed'
          );

        } catch (error) {

          console.log(
            'Notifee display error:',
            error
          );
        }

      }
    );

    return unsubscribe;

  } catch (error) {

    console.log(
      'FCM foreground listener error:',
      error
    );

    return () => {};
  }
};