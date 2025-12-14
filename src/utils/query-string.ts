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
 * Uses bracket syntax: field[operator]=value (compatible with @pubflow/bridge)
 *
 * @param filters - Array of filter definitions
 * @returns Query params object
 */
export function buildFilterParams(filters: FilterDefinition[]): Record<string, any> {
  const params: Record<string, any> = {};

  for (const filter of filters) {
    const { field, operator, value } = filter;

    // Handle different operators using bracket syntax
    switch (operator) {
      case FilterOperator.EQUALS:
      case 'eq':
        // Special case: equals doesn't need operator suffix
        params[field] = value;
        break;

      case FilterOperator.NOT_EQUALS:
      case 'ne':
        params[`${field}[ne]`] = value;
        break;

      case FilterOperator.GREATER_THAN:
      case 'gt':
        params[`${field}[gt]`] = value;
        break;

      case FilterOperator.GREATER_THAN_OR_EQUALS:
      case 'gte':
        params[`${field}[gte]`] = value;
        break;

      case FilterOperator.LESS_THAN:
      case 'lt':
        params[`${field}[lt]`] = value;
        break;

      case FilterOperator.LESS_THAN_OR_EQUALS:
      case 'lte':
        params[`${field}[lte]`] = value;
        break;

      case FilterOperator.LIKE:
      case 'like':
        params[`${field}[like]`] = value;
        break;

      case FilterOperator.ILIKE:
      case 'ilike':
        params[`${field}[ilike]`] = value;
        break;

      case FilterOperator.STARTS_WITH:
      case 'sw':
        params[`${field}[startsWith]`] = value;
        break;

      case 'startsWith':
        params[`${field}[startsWith]`] = value;
        break;

      case FilterOperator.ENDS_WITH:
      case 'ew':
        params[`${field}[endsWith]`] = value;
        break;

      case 'endsWith':
        params[`${field}[endsWith]`] = value;
        break;

      case FilterOperator.IN:
      case 'in':
        params[`${field}[in]`] = Array.isArray(value) ? value.join(',') : value;
        break;

      case FilterOperator.NOT_IN:
      case 'nin':
        params[`${field}[nin]`] = Array.isArray(value) ? value.join(',') : value;
        break;

      case FilterOperator.IS_NULL:
      case 'null':
        params[`${field}[null]`] = true;
        break;

      case FilterOperator.IS_NOT_NULL:
      case 'nnull':
        params[`${field}[notNull]`] = true;
        break;

      case 'notNull':
        params[`${field}[notNull]`] = true;
        break;

      case FilterOperator.BETWEEN:
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          params[`${field}[between]`] = `${value[0]},${value[1]}`;
        }
        break;

      case FilterOperator.NOT_BETWEEN:
      case 'nbetween':
        if (Array.isArray(value) && value.length === 2) {
          params[`${field}[notBetween]`] = `${value[0]},${value[1]}`;
        }
        break;

      case 'notBetween':
        if (Array.isArray(value) && value.length === 2) {
          params[`${field}[notBetween]`] = `${value[0]},${value[1]}`;
        }
        break;

      // @pubflow/bridge compatibility - contains is an alias for like
      case 'contains':
        params[`${field}[contains]`] = value;
        break;

      default:
        // Custom operator - use bracket syntax
        params[`${field}[${operator}]`] = value;
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

