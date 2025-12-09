/**
 * Null Operators
 * 
 * Filter operators for null checks
 */

import { FilterOperator, FilterValue } from '../types';

/**
 * Is null operator
 * 
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('deleted_at', isNull())
 * // → deleted_at_null=true
 * ```
 */
export function isNull(): FilterValue {
  return {
    operator: FilterOperator.IS_NULL,
    value: true
  };
}

/**
 * Alias for isNull
 */
export const isNullOp = isNull;

/**
 * Is not null operator
 * 
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('email_verified_at', isNotNull())
 * // → email_verified_at_nnull=true
 * ```
 */
export function isNotNull(): FilterValue {
  return {
    operator: FilterOperator.IS_NOT_NULL,
    value: true
  };
}

/**
 * Alias for isNotNull
 */
export const isNotNullOp = isNotNull;

