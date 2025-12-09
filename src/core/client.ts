/**
 * Flowfull Client
 * 
 * Main HTTP client for Flowfull backends
 */

import { 
  FlowfullConfig, 
  HttpMethod, 
  RequestOptions, 
  ApiResponse,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor
} from '../types';
import { buildURL, buildQueryString } from '../utils';
import { SessionManager } from './session-manager';
import { RequestHandler } from './request-handler';
import { QueryBuilder } from './query-builder';

/**
 * Flowfull client class
 */
export class FlowfullClient {
  private baseUrl: string;
  private config: FlowfullConfig;
  private sessionManager: SessionManager;
  private requestHandler: RequestHandler;
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  constructor(baseUrl: string, config: FlowfullConfig = {}) {
    this.baseUrl = baseUrl;
    this.config = config;
    
    // Initialize session manager
    this.sessionManager = new SessionManager({
      sessionId: config.sessionId,
      getSessionId: config.getSessionId,
      storage: config.storage,
      includeSession: config.includeSession,
      sessionHeader: config.sessionHeader
    });
    
    // Initialize request handler
    this.requestHandler = new RequestHandler({
      attempts: config.retryAttempts,
      delay: 1000,
      exponentialBackoff: true
    });
    
    // Set default headers from config
    if (config.headers) {
      this.defaultHeaders = { ...this.defaultHeaders, ...config.headers };
    }
  }
  
  /**
   * Create query builder
   * 
   * @param endpoint - API endpoint
   * @returns Query builder instance
   * 
   * @example
   * ```typescript
   * const users = await client
   *   .query('/users')
   *   .where('status', 'active')
   *   .page(1)
   *   .limit(20)
   *   .get();
   * ```
   */
  query(endpoint: string): QueryBuilder {
    return new QueryBuilder(this, endpoint);
  }
  
  /**
   * Execute GET request
   * 
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns API response
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }
  
  /**
   * Execute POST request
   * 
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param options - Request options
   * @returns API response
   */
  async post<T = any>(
    endpoint: string, 
    body?: any, 
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', body, options);
  }
  
  /**
   * Execute PUT request
   * 
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param options - Request options
   * @returns API response
   */
  async put<T = any>(
    endpoint: string, 
    body?: any, 
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', body, options);
  }
  
  /**
   * Execute PATCH request
   * 
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param options - Request options
   * @returns API response
   */
  async patch<T = any>(
    endpoint: string, 
    body?: any, 
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', body, options);
  }
  
  /**
   * Execute DELETE request
   * 
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns API response
   */
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
  
  /**
   * Execute HTTP request
   * 
   * @param endpoint - API endpoint
   * @param method - HTTP method
   * @param body - Request body
   * @param options - Request options
   * @returns API response
   */
  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // Build headers
    const headers = await this.buildHeaders(options);
    
    // Build URL with query params
    const queryString = options.params ? buildQueryString(options.params) : '';
    const url = buildURL(this.baseUrl, endpoint, queryString);
    
    // Create request config
    const requestConfig: RequestConfig = {
      method,
      url,
      headers,
      body,
      timeout: options.timeout || this.config.timeout,
      signal: options.signal
    };

    // Call onRequest callback
    if (this.config.onRequest) {
      await this.config.onRequest(requestConfig);
    }

    // Execute request
    try {
      const response = await this.requestHandler.request<T>(requestConfig);

      // Call onResponse callback
      if (this.config.onResponse) {
        await this.config.onResponse(response);
      }

      return response;
    } catch (error) {
      // Call onError callback
      if (this.config.onError && error instanceof Error) {
        this.config.onError(error);
      }

      throw error;
    }
  }

  /**
   * Build request headers
   *
   * @param options - Request options
   * @returns Headers object
   */
  private async buildHeaders(options: RequestOptions): Promise<Record<string, string>> {
    const headers = { ...this.defaultHeaders };

    // Add session header if enabled
    const includeSession = options.includeSession !== false;
    if (includeSession) {
      const sessionId = await this.sessionManager.getSessionId();
      if (sessionId) {
        const sessionHeader = this.sessionManager.getSessionHeader();
        headers[sessionHeader] = sessionId;
      }
    }

    // Add custom headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    return headers;
  }

  /**
   * Set default header
   *
   * @param key - Header key
   * @param value - Header value
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove default header
   *
   * @param key - Header key
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  /**
   * Get session ID
   *
   * @returns Session ID or null
   */
  async getSessionId(): Promise<string | null> {
    return this.sessionManager.getSessionId();
  }

  /**
   * Set session ID
   *
   * @param sessionId - Session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionManager.setSessionId(sessionId);
  }

  /**
   * Clear session
   */
  clearSession(): void {
    this.sessionManager.clearSession();
  }

  /**
   * Check if session is available
   *
   * @returns True if session is available
   */
  async hasSession(): Promise<boolean> {
    return this.sessionManager.hasSession();
  }

  /**
   * Add request interceptor
   *
   * @param interceptor - Request interceptor function
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestHandler.addRequestInterceptor(interceptor);
  }

  /**
   * Add response interceptor
   *
   * @param interceptor - Response interceptor function
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.requestHandler.addResponseInterceptor(interceptor);
  }

  /**
   * Get base URL
   *
   * @returns Base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get configuration
   *
   * @returns Configuration object
   */
  getConfig(): FlowfullConfig {
    return { ...this.config };
  }
}

