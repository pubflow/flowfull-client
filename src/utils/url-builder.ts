/**
 * URL Builder
 * 
 * Utilities for building URLs
 */

/**
 * Normalize base URL (remove trailing slash)
 * 
 * @param baseUrl - Base URL
 * @returns Normalized base URL
 */
export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

/**
 * Normalize endpoint (ensure leading slash)
 * 
 * @param endpoint - Endpoint path
 * @returns Normalized endpoint
 */
export function normalizeEndpoint(endpoint: string): string {
  if (!endpoint.startsWith('/')) {
    return `/${endpoint}`;
  }
  return endpoint;
}

/**
 * Build full URL from base and endpoint
 * 
 * @param baseUrl - Base URL
 * @param endpoint - Endpoint path
 * @param queryString - Query string (optional, with leading ?)
 * @returns Full URL
 */
export function buildURL(baseUrl: string, endpoint: string, queryString?: string): string {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const url = `${normalizedBase}${normalizedEndpoint}`;
  
  if (queryString && queryString.length > 0) {
    return `${url}${queryString}`;
  }
  
  return url;
}

/**
 * Check if URL is absolute
 * 
 * @param url - URL to check
 * @returns True if absolute URL
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

