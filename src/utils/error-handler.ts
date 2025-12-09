/**
 * Error Handler
 * 
 * Utilities for handling HTTP and network errors
 */

import { ApiResponse } from '../types';

/**
 * HTTP error class
 */
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Network error class
 */
export class NetworkError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Handle HTTP error response
 * 
 * @param response - Fetch response
 * @param data - Response data
 * @returns API response
 */
export function handleHttpError<T = any>(
  response: Response,
  data: any
): ApiResponse<T> {
  const error = data?.error || data?.message || `HTTP ${response.status} error`;
  
  return {
    success: false,
    error,
    message: data?.message,
    status: response.status,
    data: data?.data
  };
}

/**
 * Handle network error
 * 
 * @param error - Error object
 * @returns API response
 */
export function handleNetworkError<T = any>(error: Error): ApiResponse<T> {
  let message = 'Network error occurred';
  
  if (error.name === 'AbortError') {
    message = 'Request was cancelled';
  } else if (error.message.includes('timeout')) {
    message = 'Request timeout';
  } else if (error.message.includes('Failed to fetch')) {
    message = 'Network connection failed';
  } else {
    message = error.message || message;
  }
  
  return {
    success: false,
    error: message,
    status: 0
  };
}

/**
 * Check if error is a network error
 * 
 * @param error - Error object
 * @returns True if network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.name === 'TypeError' ||
    error.name === 'NetworkError' ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed')
  );
}

/**
 * Check if error is a timeout error
 * 
 * @param error - Error object
 * @returns True if timeout error
 */
export function isTimeoutError(error: Error): boolean {
  return (
    error.name === 'AbortError' ||
    error.message.includes('timeout') ||
    error.message.includes('timed out')
  );
}

