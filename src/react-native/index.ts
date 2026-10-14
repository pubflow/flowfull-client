/**
 * React Native Integration
 *
 * Lightweight helpers for using the universal Flowfull client in React Native.
 * Storage is injected by the app so this subpath works with AsyncStorage,
 * SecureStore wrappers, or any custom adapter.
 */

import { useMemo } from 'react';
import { createFlowfull } from '../factory';
import type { FlowfullClient } from '../core/client';
import type { FlowfullConfig, StorageAdapter } from '../types';

export interface ReactNativeFlowfullOptions extends FlowfullConfig {
  storage?: StorageAdapter;
}

export function createReactNativeFlowfullClient(
  baseUrl: string,
  config: ReactNativeFlowfullOptions = {}
): FlowfullClient {
  return createFlowfull(baseUrl, config);
}

export function useReactNativeFlowfullClient(
  baseUrl: string,
  config: ReactNativeFlowfullOptions = {}
): FlowfullClient {
  return useMemo(
    () => createReactNativeFlowfullClient(baseUrl, config),
    [
      baseUrl,
      config.sessionId,
      config.includeSession,
      config.sessionHeader,
      config.timeout,
      config.retryAttempts,
      config.storage,
      config.getSessionId,
    ]
  );
}
