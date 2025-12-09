/**
 * Filter Types
 * 
 * Types for filter operators and definitions
 */

/**
 * Filter operator enum
 */
export enum FilterOperator {
  // Comparison
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  
  // String
  LIKE = 'like',
  ILIKE = 'ilike',
  STARTS_WITH = 'sw',
  ENDS_WITH = 'ew',
  
  // Array
  IN = 'in',
  NOT_IN = 'nin',
  
  // Null
  IS_NULL = 'null',
  IS_NOT_NULL = 'nnull',
  
  // Range
  BETWEEN = 'between',
  NOT_BETWEEN = 'nbetween'
}

/**
 * Filter definition
 */
export interface FilterDefinition {
  /**
   * Field to filter on
   */
  field: string;
  
  /**
   * Filter operator
   */
  operator: FilterOperator | string;
  
  /**
   * Filter value
   */
  value: any;
}

/**
 * Filter value (returned by operator functions)
 */
export interface FilterValue {
  /**
   * Filter operator
   */
  operator: FilterOperator | string;
  
  /**
   * Filter value
   */
  value: any;
}

