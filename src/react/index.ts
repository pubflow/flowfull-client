/**
 * React Integration
 *
 * React hooks and helpers for Flowfull client.
 */

import { useMemo } from 'react';
import { createFlowfull } from '../factory';
import type { FlowfullClient } from '../core/client';
import type { FlowfullConfig } from '../types';
import { createBrowserStorageAdapter, getPubflowSessionId } from '../session';

export interface UseFlowfullClientOptions extends FlowfullConfig {
  browserStorage?: Storage;
}

export function createPubflowFlowfullClient(
  baseUrl: string,
  config: UseFlowfullClientOptions = {}
): FlowfullClient {
  const { browserStorage, ...clientConfig } = config;

  return createFlowfull(baseUrl, {
    ...clientConfig,
    getSessionId: clientConfig.getSessionId ?? (() => getPubflowSessionId(browserStorage)),
    storage: clientConfig.storage ?? createBrowserStorageAdapter(browserStorage),
  });
}

export function useFlowfullClient(
  baseUrl: string,
  config: UseFlowfullClientOptions = {}
): FlowfullClient {
  return useMemo(
    () => createPubflowFlowfullClient(baseUrl, config),
    [
      baseUrl,
      config.sessionId,
      config.includeSession,
      config.sessionHeader,
      config.timeout,
      config.retryAttempts,
      config.storage,
      config.browserStorage,
      config.getSessionId,
    ]
  );
}

export { getPubflowSessionId, createBrowserStorageAdapter };
