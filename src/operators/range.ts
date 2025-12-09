/**
 * Range Operators
 * 
 * Filter operators for range operations
 */

import { FilterOperator, FilterValue } from '../types';

/**
 * Between operator (inclusive)
 * 
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('price', between(10, 100))
 * // → price_min=10&price_max=100
 * ```
 */
export function between(min: any, max: any): FilterValue {
  return {
    operator: FilterOperator.BETWEEN,
    value: [min, max]
  };
}

/**
 * Not between operator
 * 
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('price', notBetween(50, 200))
 * // → price_nmin=50&price_nmax=200
 * ```
 */
export function notBetween(min: any, max: any): FilterValue {
  return {
    operator: FilterOperator.NOT_BETWEEN,
    value: [min, max]
  };
}

/**
 * Alias for notBetween
 */
export const nbetween = notBetween;

