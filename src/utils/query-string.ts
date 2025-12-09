/**
 * Query String Builder
 * 
 * Utilities for building query strings from objects
 */

import { FilterDefinition, FilterOperator } from '../types';

/**
 * Encode query parameter value
 * 
 * @param value - Value to encode
 * @returns Encoded value
 */
export function encodeQueryValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (Array.isArray(value)) {
    return value.map(v => encodeURIComponent(String(v))).join(',');
  }
  
  if (typeof value === 'object') {
    return encodeURIComponent(JSON.stringify(value));
  }
  
  return encodeURIComponent(String(value));
}

/**
 * Build filter query params
 * 
 * @param filters - Array of filter definitions
 * @returns Query params object
 */
export function buildFilterParams(filters: FilterDefinition[]): Record<string, any> {
  const params: Record<string, any> = {};
  
  for (const filter of filters) {
    const { field, operator, value } = filter;
    
    // Handle different operators
    switch (operator) {
      case FilterOperator.EQUALS:
      case 'eq':
        params[field] = value;
        break;
        
      case FilterOperator.NOT_EQUALS:
      case 'ne':
        params[`${field}_ne`] = value;
        break;
        
      case FilterOperator.GREATER_THAN:
      case 'gt':
        params[`${field}_gt`] = value;
        break;
        
      case FilterOperator.GREATER_THAN_OR_EQUALS:
      case 'gte':
        params[`${field}_gte`] = value;
        break;
        
      case FilterOperator.LESS_THAN:
      case 'lt':
        params[`${field}_lt`] = value;
        break;
        
      case FilterOperator.LESS_THAN_OR_EQUALS:
      case 'lte':
        params[`${field}_lte`] = value;
        break;
        
      case FilterOperator.LIKE:
      case 'like':
        params[`${field}_like`] = value;
        break;
        
      case FilterOperator.ILIKE:
      case 'ilike':
        params[`${field}_ilike`] = value;
        break;
        
      case FilterOperator.STARTS_WITH:
      case 'sw':
      case 'startsWith':
        params[`${field}_sw`] = value;
        break;

      case FilterOperator.ENDS_WITH:
      case 'ew':
      case 'endsWith':
        params[`${field}_ew`] = value;
        break;
        
      case FilterOperator.IN:
      case 'in':
        params[`${field}_in`] = Array.isArray(value) ? value.join(',') : value;
        break;
        
      case FilterOperator.NOT_IN:
      case 'nin':
        params[`${field}_nin`] = Array.isArray(value) ? value.join(',') : value;
        break;
        
      case FilterOperator.IS_NULL:
      case 'null':
        params[`${field}_null`] = true;
        break;
        
      case FilterOperator.IS_NOT_NULL:
      case 'nnull':
        params[`${field}_nnull`] = true;
        break;
        
      case FilterOperator.BETWEEN:
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          params[`${field}_min`] = value[0];
          params[`${field}_max`] = value[1];
        }
        break;
        
      case FilterOperator.NOT_BETWEEN:
      case 'nbetween':
        if (Array.isArray(value) && value.length === 2) {
          params[`${field}_nmin`] = value[0];
          params[`${field}_nmax`] = value[1];
        }
        break;
        
      default:
        // Custom operator - use as suffix
        params[`${field}_${operator}`] = value;
    }
  }
  
  return params;
}

/**
 * Build query string from params object
 * 
 * @param params - Query parameters
 * @returns Query string (with leading ?)
 */
export function buildQueryString(params: Record<string, any>): string {
  const entries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeQueryValue(value)}`);
  
  if (entries.length === 0) {
    return '';
  }
  
  return `?${entries.join('&')}`;
}

