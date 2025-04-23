
/**
 * Environment configuration utilities
 */

export const isVercel = (): boolean => {
  // For browser environments on Vercel
  if (typeof window !== 'undefined') {
    return window.location.hostname.includes('vercel.app') ||
           import.meta.env.VITE_VERCEL === 'true';
  }
  
  // For Node.js environments (during build)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VERCEL === '1' || 
           process.env.VERCEL === 'true';
  }
  
  return false;
};

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const getBaseUrl = (): string => {
  if (isVercel()) {
    if (typeof window !== 'undefined') {
      return window.location.origin || '';
    }
  }
  
  // For local development or other environments
  return '';
};
