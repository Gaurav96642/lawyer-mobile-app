
/**
 * Platform adapter to handle differences between web and mobile environments
 */

import { isVercel, isBrowser } from './environment';

export const getPlatformConfig = () => {
  // Consider Vercel deployments as web platform
  const isVercelDeployment = isVercel();
  
  // Make sure this works correctly on Vercel
  const isWeb = isVercelDeployment || 
                (isBrowser() && 
                (!window.Capacitor || 
                 typeof window.Capacitor === 'undefined'));
  
  return {
    isWeb,
    isVercel: isVercelDeployment,
    isMobile: !isWeb && isBrowser(),
    isNative: isBrowser() && 
              typeof window.Capacitor !== 'undefined' && 
              window.Capacitor.isNative === true && 
              !isVercelDeployment,
    needsSafeArea: isBrowser() && (
      // iOS with notch detection (simplified)
      /iPhone|iPad/.test(navigator.userAgent) && 
      (window.innerHeight / window.innerWidth > 2 || window.innerWidth / window.innerHeight > 2)
    )
  };
};

// Add Capacitor type definition for better TypeScript support
declare global {
  interface Window {
    Capacitor?: {
      isNative: boolean;
      getPlatform: () => 'ios' | 'android' | 'web';
    };
  }
}
