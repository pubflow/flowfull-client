/**
 * @pubflow/flowfull-client
 *
 * Universal HTTP client for Flowfull backends with advanced query building,
 * filter operators, session management, multi-tenant support, and file uploads.
 *
 * @example
 * ```typescript
 * import { createFlowfull, eq, gte, between } from '@pubflow/flowfull-client';
 *
 * // Create client
 * const api = createFlowfull('https://api.myapp.com');
 *
 * // Simple GET
 * const users = await api.get('/users');
 *
 * // Query builder
 * const products = await api
 *   .query('/products')
 *   .where('status', 'active')
 *   .where('price', between(10, 100))
 *   .sort('price', 'asc')
 *   .page(1)
 *   .limit(20)
 *   .get();
 *
 * // Multi-tenant support
 * const tenant1 = createFlowfull('https://tenant1.api.com', {
 *   storageConfig: { adapter: localStorage, prefix: 'tenant1' }
 * });
 * const tenant2 = createFlowfull('https://tenant2.api.com', {
 *   storageConfig: { adapter: localStorage, prefix: 'tenant2' }
 * });
 *
 * // File upload
 * const response = await api.uploadFile('/auth/upload/picture', imageFile, {
 *   field: 'picture',
 *   onProgress: (progress) => console.log(`Upload: ${progress}%`)
 * });
 * ```
 */

// Core
export { FlowfullClient } from './core/client';
export { QueryBuilder } from './core/query-builder';
export { SessionManager } from './core/session-manager';
export { RequestHandler } from './core/request-handler';

// Helpers
export { PaymentsHelper } from './helpers/payments';

// Factory
export { createFlowfull } from './factory';

// Types
export * from './types';

// Operators
export * from './operators';

// Utils
export * from './utils';

