/**
 * @pubflow/flowfull-client
 * 
 * Universal HTTP client for Flowfull backends with advanced query building,
 * filter operators, and session management.
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
 * ```
 */

// Core
export { FlowfullClient } from './core/client';
export { QueryBuilder } from './core/query-builder';
export { SessionManager } from './core/session-manager';
export { RequestHandler } from './core/request-handler';

// Factory
export { createFlowfull } from './factory';

// Types
export * from './types';

// Operators
export * from './operators';

// Utils
export * from './utils';

