/**
 * Client Configuration Types
 * 
 * Types for Flowfull client configuration
 */

import { RequestConfig, ApiResponse } from './request';

/**
 * Storage adapter interface (compatible with @pubflow/core)
 */
export interface StorageAdapter {
  /**
   * Get item from storage
   */
  getItem(key: string): Promise<string | null> | string | null;

  /**
   * Set item in storage
   */
  setItem(key: string, value: string): Promise<void> | void;

  /**
   * Remove item from storage
   */
  removeItem(key: string): Promise<void> | void;
}

/**
 * Storage configuration for multi-tenant support
 */
export interface StorageConfig {
  /**
   * Storage adapter instance
   */
  adapter?: StorageAdapter;

  /**
   * Storage key prefix for multi-tenant isolation
   * @example 'tenant1' -> 'tenant1_pubflow_session_id'
   */
  prefix?: string;
}

/**
 * Session configuration
 */
export interface SessionConfig {
  /**
   * Static session ID
   */
  sessionId?: string;

  /**
   * Function to get session ID (sync or async)
   */
  getSessionId?: () => string | Promise<string> | null | Promise<null>;

  /**
   * Storage adapter for session management
   */
  storage?: StorageAdapter;

  /**
   * Storage configuration (alternative to storage adapter)
   */
  storageConfig?: StorageConfig;

  /**
   * Whether to include session in requests
   * @default true
   */
  includeSession?: boolean;

  /**
   * Session header name
   * @default 'X-Session-ID'
   */
  sessionHeader?: string;
}

/**
 * Flowfull client configuration
 */
export interface FlowfullConfig {
  /**
   * Instance name (for multiple instances)
   */
  name?: string;

  /**
   * Session configuration
   */
  sessionId?: string;
  getSessionId?: () => string | Promise<string> | null | Promise<null>;
  storage?: StorageAdapter;
  storageConfig?: StorageConfig;
  includeSession?: boolean;
  sessionHeader?: string;

  /**
   * HTTP configuration
   */
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;

  /**
   * Callbacks
   */
  onError?: (error: Error) => void;
  onRequest?: (config: RequestConfig) => void | Promise<void>;
  onResponse?: (response: ApiResponse) => void | Promise<void>;
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/**
 * Response interceptor function
 */
export type ResponseInterceptor = (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;

