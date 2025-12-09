/**
 * Array Operators
 * 
 * Filter operators for array operations
 */

import { FilterOperator, FilterValue } from '../types';

/**
 * In operator (value in array)
 * 
 * @param values - Array of values
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('status', inOp(['active', 'pending']))
 * // → status_in=active,pending
 * ```
 */
export function inOp(values: any[]): FilterValue {
  return {
    operator: FilterOperator.IN,
    value: values
  };
}

/**
 * Export as 'in' for convenience (note: 'in' is a reserved keyword)
 * Use as: import { inOp as in } from '@pubflow/flowfull-client'
 */
export { inOp as in };

/**
 * Not in operator (value not in array)
 * 
 * @param values - Array of values
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('status', notIn(['banned', 'deleted']))
 * // → status_nin=banned,deleted
 * ```
 */
export function notIn(values: any[]): FilterValue {
  return {
    operator: FilterOperator.NOT_IN,
    value: values
  };
}

/**
 * Alias for notIn
 */
export const nin = notIn;

