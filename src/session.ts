/**
 * Pubflow session helpers shared by browser integrations.
 */

import type { StorageAdapter } from './types';

export const PUBFLOW_SESSION_KEYS = [
  'pubflow_session_id',
  'session_id',
  'pubflow_session',
  'sessionId',
  'x-session-id'
] as const;

export function getPubflowSessionId(storage?: Pick<Storage, 'getItem'> | null): string | null {
  if (typeof window === 'undefined') return null;

  const source = storage ?? window.localStorage;

  for (const key of PUBFLOW_SESSION_KEYS) {
    const value = source.getItem(key);
    if (value) return value;
  }

  return null;
}

export function createBrowserStorageAdapter(storage?: Storage): StorageAdapter {
  return {
    getItem: (key: string) => {
      const source = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
      return source?.getItem(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      const source = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
      source?.setItem(key, value);
    },
    removeItem: (key: string) => {
      const source = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
      source?.removeItem(key);
    }
  };
}
