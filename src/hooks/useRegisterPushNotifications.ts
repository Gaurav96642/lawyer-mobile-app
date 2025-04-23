
import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { useMobilePlatform } from './useMobilePlatform';

export const useRegisterPushNotifications = () => {
  const { isNative } = useMobilePlatform();

  useEffect(() => {
    if (!isNative || !PushNotifications) return;

    const registerNotifications = async () => {
      try {
        // Check permission
        const permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          const requestStatus = await PushNotifications.requestPermissions();
          if (requestStatus.receive !== 'granted') {
            console.log('Push notification permission was denied');
            return;
          }
        } else if (permStatus.receive !== 'granted') {
          console.log('Push notification permission was denied');
          return;
        }

        // Register with FCM/APNs
        await PushNotifications.register();

        // Registration event
        PushNotifications.addListener('registration', (token) => {
          console.log('Push registration success, token: ', token.value);
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.error('Error on push registration: ', error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received: ', notification);
          // Place your in-app notification handling here (e.g., show a toast)
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed', notification);
          // For navigation or other actions
        });
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    registerNotifications();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [isNative]);
};
