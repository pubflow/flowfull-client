/**
 * Query Builder Types
 * 
 * Types for query builder
 */

import { FilterDefinition } from './filters';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort definition
 */
export interface SortDefinition {
  /**
   * Field to sort by
   */
  field: string;
  
  /**
   * Sort direction
   */
  direction: SortDirection;
}

/**
 * Query parameters
 */
export interface QueryParams {
  /**
   * Search term
   */
  q?: string;
  
  /**
   * Filters
   */
  filters?: FilterDefinition[];
  
  /**
   * Page number
   */
  page?: number;
  
  /**
   * Items per page
   */
  limit?: number;
  
  /**
   * Offset
   */
  offset?: number;
  
  /**
   * Sort field
   */
  sort?: string;
  
  /**
   * Sort direction
   */
  order?: SortDirection;
  
  /**
   * Multiple sorts
   */
  sorts?: SortDefinition[];
  
  /**
   * Custom parameters
   */
  [key: string]: any;
}

