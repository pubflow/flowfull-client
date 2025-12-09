/**
 * Storage Detector
 * 
 * Auto-detect session ID from common storage keys
 */

/**
 * Common session keys to check
 */
export const COMMON_SESSION_KEYS = [
  'pubflow_session_id',
  'session_id',
  'sessionId',
  'X-Session-ID',
  'x-session-id'
];

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Check if we're in a React Native environment
 */
export function isReactNative(): boolean {
  // @ts-ignore - navigator.product is deprecated but still used in RN
  return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}

/**
 * Get session from localStorage (browser)
 * 
 * @returns Session ID or null
 */
export function getSessionFromLocalStorage(): string | null {
  if (!isBrowser()) {
    return null;
  }
  
  for (const key of COMMON_SESSION_KEYS) {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return value;
      }
    } catch (error) {
      // Ignore errors (e.g., localStorage not available)
      continue;
    }
  }
  
  return null;
}

/**
 * Get session from AsyncStorage (React Native)
 *
 * @returns Session ID or null
 */
export async function getSessionFromAsyncStorage(): Promise<string | null> {
  if (!isReactNative()) {
    return null;
  }

  try {
    // Dynamic import to avoid errors in non-RN environments
    // @ts-ignore - AsyncStorage may not be available
    const AsyncStorage = await import('@react-native-async-storage/async-storage');

    for (const key of COMMON_SESSION_KEYS) {
      try {
        const value = await AsyncStorage.default.getItem(key);
        if (value) {
          return value;
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    // AsyncStorage not available
    return null;
  }

  return null;
}

/**
 * Auto-detect session ID from common storage keys
 * 
 * @returns Session ID or null
 */
export async function autoDetectSessionId(): Promise<string | null> {
  // Try localStorage first (browser)
  const localStorageSession = getSessionFromLocalStorage();
  if (localStorageSession) {
    return localStorageSession;
  }
  
  // Try AsyncStorage (React Native)
  const asyncStorageSession = await getSessionFromAsyncStorage();
  if (asyncStorageSession) {
    return asyncStorageSession;
  }
  
  return null;
}

