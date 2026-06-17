/**
 * Next.js Client Integration
 *
 * Client-side helpers for Next.js apps. Server utilities are exported from
 * @pubflow/flowfull-client/nextjs/server.
 */

export {
  createPubflowFlowfullClient,
  useFlowfullClient,
  getPubflowSessionId,
  createBrowserStorageAdapter,
} from '../react';
export type { UseFlowfullClientOptions } from '../react';
