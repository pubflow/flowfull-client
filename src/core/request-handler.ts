/**
 * Request Handler
 * 
 * Handles HTTP requests with timeout, retry, and interceptors
 */

import { 
  RequestConfig, 
  ApiResponse, 
  RequestInterceptor, 
  ResponseInterceptor,
  RetryConfig 
} from '../types';
import { handleHttpError, handleNetworkError, isNetworkError } from '../utils';

/**
 * Request handler class
 */
export class RequestHandler {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private retryConfig: RetryConfig;
  
  constructor(retryConfig: RetryConfig = {}) {
    this.retryConfig = {
      attempts: 3,
      delay: 1000,
      exponentialBackoff: true,
      ...retryConfig
    };
  }
  
  /**
   * Add request interceptor
   * 
   * @param interceptor - Request interceptor function
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }
  
  /**
   * Add response interceptor
   * 
   * @param interceptor - Response interceptor function
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }
  
  /**
   * Execute request with timeout, retry, and interceptors
   * 
   * @param config - Request configuration
   * @returns API response
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    // Apply request interceptors
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    
    // Execute request with retry
    let lastError: Error | null = null;
    let lastResponse: ApiResponse<T> | null = null;
    const maxAttempts = this.retryConfig.attempts || 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await this.executeRequest<T>(finalConfig);

        // Check if we should retry on HTTP error (5xx)
        if (!response.success && response.status >= 500 && attempt < maxAttempts - 1) {
          lastResponse = response;
          const delay = this.calculateRetryDelay(attempt);
          await this.sleep(delay);
          continue;
        }

        // Apply response interceptors
        let finalResponse = response;
        for (const interceptor of this.responseInterceptors) {
          finalResponse = await interceptor(finalResponse);
        }

        return finalResponse;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on last attempt
        if (attempt === maxAttempts - 1) {
          break;
        }

        // Don't retry on non-network errors
        if (!isNetworkError(lastError)) {
          break;
        }

        // Wait before retry
        const delay = this.calculateRetryDelay(attempt);
        await this.sleep(delay);
      }
    }

    // All attempts failed
    if (lastResponse) {
      return lastResponse;
    }
    return handleNetworkError<T>(lastError!);
  }
  
  /**
   * Execute single HTTP request
   * 
   * @param config - Request configuration
   * @returns API response
   */
  private async executeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { method, url, headers, body, timeout, signal } = config;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;
    
    try {
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: signal || controller.signal
      };
      
      // Add body for non-GET requests
      if (body && method !== 'GET') {
        if (typeof body === 'object') {
          fetchOptions.body = JSON.stringify(body);
        } else {
          fetchOptions.body = body;
        }
      }
      
      // Execute fetch
      const response = await fetch(url, fetchOptions);
      
      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Parse response
      return await this.parseResponse<T>(response);
    } catch (error) {
      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      throw error;
    }
  }
  
  /**
   * Parse fetch response
   * 
   * @param response - Fetch response
   * @returns API response
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any;
    
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      data = {};
    }
    
    // Handle error responses
    if (!response.ok) {
      return handleHttpError<T>(response, data);
    }
    
    // Success response
    return {
      success: true,
      data: data && typeof data === 'object' && 'data' in data ? data.data as T : data as T,
      message: data.message,
      status: response.status,
      meta: data.meta || data.pagination,
      userContext: data.user_context
    };
  }
  
  /**
   * Calculate retry delay with exponential backoff
   * 
   * @param attempt - Current attempt number (0-based)
   * @returns Delay in milliseconds
   */
  private calculateRetryDelay(attempt: number): number {
    const baseDelay = this.retryConfig.delay || 1000;
    
    if (this.retryConfig.exponentialBackoff) {
      return baseDelay * Math.pow(2, attempt);
    }
    
    return baseDelay;
  }
  
  /**
   * Sleep for specified milliseconds
   * 
   * @param ms - Milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
