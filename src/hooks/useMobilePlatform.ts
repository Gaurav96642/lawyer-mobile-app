
import { useEffect, useState } from 'react';
import { isVercel } from '../lib/environment';

export const useMobilePlatform = () => {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    const isInVercelEnvironment = isVercel();
    
    // Handle Capacitor availability
    const hasCapacitor = typeof window !== 'undefined' && 
                         typeof window.Capacitor !== 'undefined';
    
    const isNative = hasCapacitor && window.Capacitor.isNative;

    // Also check for mobile browser
    const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    setIsMobileDevice(isNative || isMobileBrowser);

    // Device plugin is only available natively; skip Device.getInfo() to avoid import error
    if (isNative && !isInVercelEnvironment && 
        (window as any).Device && 
        typeof (window as any).Device.getInfo === "function") {
      (window as any).Device.getInfo().then(setDeviceInfo).catch(console.error);
    }
  }, []);

  // Safe Capacitor platform access
  const getPlatform = () => {
    if (typeof window !== 'undefined' && 
        typeof window.Capacitor !== 'undefined') {
      return window.Capacitor.getPlatform();
    }
    return 'web';
  };

  return {
    isLoading: isMobileDevice === null,
    isMobile: !!isMobileDevice,
    isNative: typeof window !== 'undefined' && 
              typeof window.Capacitor !== 'undefined' && 
              window.Capacitor.isNative,
    platform: getPlatform(),
    isIOS: getPlatform() === 'ios',
    isAndroid: getPlatform() === 'android',
    isWeb: getPlatform() === 'web' || isVercel(),
    deviceInfo,
  };
};
