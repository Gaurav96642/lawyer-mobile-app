
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.lawyers.anywhere',
  appName: 'LawyersAnywhere',
  webDir: 'dist',
  server: {
    // url: 'https://691e6b84-0309-4419-8aff-1cb4af2494f6.lovableproject.com?forceHideBadge=true',
    allowNavigation:["webserver.greenacres-popcorn.com"],
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#2B5E91',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      useDialog: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    backgroundColor: '#ffffff',
  },
  ios: {
    backgroundColor: '#ffffff',
  },
};

export default config;
