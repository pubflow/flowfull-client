/**
 * String Operators
 * 
 * Filter operators for string operations
 */

import { FilterOperator, FilterValue } from '../types';

/**
 * Like operator (contains, case-sensitive)
 * 
 * @param value - String to search for
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('name', like('john'))
 * // → name_like=john
 * ```
 */
export function like(value: string): FilterValue {
  return {
    operator: FilterOperator.LIKE,
    value
  };
}

/**
 * Alias for like
 */
export const contains = like;

/**
 * iLike operator (contains, case-insensitive)
 * 
 * @param value - String to search for
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('name', ilike('JOHN'))
 * // → name_ilike=JOHN
 * ```
 */
export function ilike(value: string): FilterValue {
  return {
    operator: FilterOperator.ILIKE,
    value
  };
}

/**
 * Alias for ilike
 */
export const icontains = ilike;

/**
 * Starts with operator
 * 
 * @param value - String prefix
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('name', startsWith('A'))
 * // → name_sw=A
 * ```
 */
export function startsWith(value: string): FilterValue {
  return {
    operator: FilterOperator.STARTS_WITH,
    value
  };
}

/**
 * Alias for startsWith
 */
export const sw = startsWith;

/**
 * Ends with operator
 * 
 * @param value - String suffix
 * @returns Filter value
 * 
 * @example
 * ```typescript
 * query.where('email', endsWith('@gmail.com'))
 * // → email_ew=@gmail.com
 * ```
 */
export function endsWith(value: string): FilterValue {
  return {
    operator: FilterOperator.ENDS_WITH,
    value
  };
}

/**
 * Alias for endsWith
 */
export const ew = endsWith;

