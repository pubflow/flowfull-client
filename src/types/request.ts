/**
 * Request/Response Types
 * 
 * Types for HTTP requests and responses
 */

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request options
 */
export interface RequestOptions {
  /**
   * Custom headers for this request
   */
  headers?: Record<string, string>;
  
  /**
   * Query parameters
   */
  params?: Record<string, any>;
  
  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
  
  /**
   * Whether to include session header
   * @default true
   */
  includeSession?: boolean;
  
  /**
   * AbortSignal for cancelling requests
   */
  signal?: AbortSignal;
  
  /**
   * Error callback
   */
  onError?: (error: Error) => void;
}

/**
 * API response
 */
export interface ApiResponse<T = any> {
  /**
   * Whether the request was successful
   */
  success: boolean;
  
  /**
   * Response data
   */
  data?: T;
  
  /**
   * Error message (if success is false)
   */
  error?: string;
  
  /**
   * Additional message
   */
  message?: string;
  
  /**
   * HTTP status code
   */
  status: number;
  
  /**
   * Pagination metadata
   */
  meta?: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /**
   * Current page number
   */
  page?: number;
  
  /**
   * Items per page
   */
  limit?: number;
  
  /**
   * Total number of items
   */
  total?: number;
  
  /**
   * Total number of pages
   */
  totalPages?: number;
  
  /**
   * Whether there are more pages
   */
  hasMore?: boolean;
  
  /**
   * Current page (alternative naming)
   */
  currentPage?: number;
  
  /**
   * Items per page (alternative naming)
   */
  perPage?: number;
  
  /**
   * Total items (alternative naming)
   */
  totalItems?: number;
}

/**
 * Request configuration
 */
export interface RequestConfig {
  /**
   * Request method
   */
  method: HttpMethod;
  
  /**
   * Request URL
   */
  url: string;
  
  /**
   * Request headers
   */
  headers: Record<string, string>;
  
  /**
   * Request body
   */
  body?: any;
  
  /**
   * Request timeout
   */
  timeout?: number;
  
  /**
   * Abort signal
   */
  signal?: AbortSignal;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  /**
   * Number of retry attempts
   * @default 3
   */
  attempts?: number;

  /**
   * Delay between retries in milliseconds
   * @default 1000
   */
  delay?: number;

  /**
   * Whether to use exponential backoff
   * @default true
   */
  exponentialBackoff?: boolean;
}

/**
 * File upload options
 */
export interface UploadFileOptions {
  /**
   * Form field name for the file
   * @default 'file'
   */
  field?: string;

  /**
   * Additional form data to include
   */
  data?: Record<string, string | number | boolean>;

  /**
   * Custom headers for the upload request
   * Useful for S3, B2, R2, Azure, etc.
   */
  headers?: Record<string, string>;

  /**
   * Progress callback (0-100)
   */
  onProgress?: (progress: number) => void;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Whether to include session header
   * @default true
   */
  includeSession?: boolean;

  /**
   * AbortSignal for cancelling upload
   */
  signal?: AbortSignal;
}

/**
 * Upload progress event
 */
export interface UploadProgress {
  /**
   * Bytes loaded
   */
  loaded: number;

  /**
   * Total bytes
   */
  total: number;

  /**
   * Progress percentage (0-100)
   */
  percentage: number;
}

