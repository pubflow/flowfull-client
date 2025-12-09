/**
 * Comparison Operators
 * 
 * Filter operators for comparison operations
 */

import { FilterOperator, FilterValue } from '../types';

/**
 * Equals operator
 * 
 * @param value - Value to compare
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('status', eq('active'))
 * // → status=active
 * ```
 */
export function eq(value: any): FilterValue {
  return {
    operator: FilterOperator.EQUALS,
    value
  };
}

/**
 * Alias for eq
 */
export const equals = eq;

/**
 * Not equals operator
 * 
 * @param value - Value to compare
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('status', ne('inactive'))
 * // → status_ne=inactive
 * ```
 */
export function ne(value: any): FilterValue {
  return {
    operator: FilterOperator.NOT_EQUALS,
    value
  };
}

/**
 * Alias for ne
 */
export const notEquals = ne;

/**
 * Greater than operator
 * 
 * @param value - Value to compare
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('age', gt(18))
 * // → age_gt=18
 * ```
 */
export function gt(value: any): FilterValue {
  return {
    operator: FilterOperator.GREATER_THAN,
    value
  };
}

/**
 * Alias for gt
 */
export const greaterThan = gt;

/**
 * Greater than or equals operator
 * 
 * @param value - Value to compare
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('price', gte(50))
 * // → price_gte=50
 * ```
 */
export function gte(value: any): FilterValue {
  return {
    operator: FilterOperator.GREATER_THAN_OR_EQUALS,
    value
  };
}

/**
 * Alias for gte
 */
export const greaterThanOrEquals = gte;

/**
 * Less than operator
 * 
 * @param value - Value to compare
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('price', lt(100))
 * // → price_lt=100
 * ```
 */
export function lt(value: any): FilterValue {
  return {
    operator: FilterOperator.LESS_THAN,
    value
  };
}

/**
 * Alias for lt
 */
export const lessThan = lt;

/**
 * Less than or equals operator
 * 
 * @param value - Value to compare
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('total', lte(500))
 * // → total_lte=500
 * ```
 */
export function lte(value: any): FilterValue {
  return {
    operator: FilterOperator.LESS_THAN_OR_EQUALS,
    value
  };
}

/**
 * Alias for lte
 */
export const lessThanOrEquals = lte;

