/**
 * Factory Function
 * 
 * Convenient factory function for creating Flowfull clients
 */

import { FlowfullClient } from './core';
import { FlowfullConfig } from './types';

/**
 * Create Flowfull client instance
 *
 * @param baseUrl - Base URL of the Flowfull instance
 * @param config - Client configuration
 * @returns Flowfull client instance
 *
 * @example
 * ```typescript
 * // Simple usage
 * const api = createFlowfull('https://api.myapp.com');
 *
 * // With configuration
 * const api = createFlowfull('https://api.myapp.com', {
 *   sessionId: 'my-session-id',
 *   timeout: 10000,
 *   headers: {
 *     'X-Custom-Header': 'value'
 *   }
 * });
 *
 * // Multiple instances (multi-tenant)
 * const mainApi = createFlowfull('https://api.myapp.com', {
 *   name: 'main',
 *   storageConfig: {
 *     adapter: localStorage,
 *     prefix: 'main'
 *   }
 * });
 *
 * const analyticsApi = createFlowfull('https://analytics.myapp.com', {
 *   name: 'analytics',
 *   storageConfig: {
 *     adapter: localStorage,
 *     prefix: 'analytics'
 *   }
 * });
 *
 * // File upload
 * const response = await api.uploadFile('/auth/upload/picture', imageFile, {
 *   field: 'picture',
 *   onProgress: (progress) => console.log(`Upload: ${progress}%`)
 * });
 * ```
 */
export function createFlowfull(baseUrl: string, config?: FlowfullConfig): FlowfullClient {
  return new FlowfullClient(baseUrl, config);
}

