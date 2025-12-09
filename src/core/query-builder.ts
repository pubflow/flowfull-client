/**
 * Query Builder
 * 
 * Chainable query builder for constructing API requests
 */

import {
  FilterDefinition,
  FilterOperator,
  FilterValue,
  SortDirection,
  SortDefinition,
  QueryParams,
  ApiResponse,
  RequestOptions
} from '../types';
import { buildFilterParams, buildQueryString } from '../utils';

// Forward declaration to avoid circular dependency
interface FlowfullClientInterface {
  get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}

/**
 * Query builder class
 */
export class QueryBuilder {
  private endpoint: string;
  private filters: FilterDefinition[] = [];
  private searchTerm?: string;
  private pageNum?: number;
  private limitNum?: number;
  private offsetNum?: number;
  private sorts: SortDefinition[] = [];
  private customParams: Record<string, any> = {};
  private customHeaders: Record<string, string> = {};
  private client: FlowfullClientInterface;

  constructor(client: FlowfullClientInterface, endpoint: string) {
    this.client = client;
    this.endpoint = endpoint;
  }
  
  /**
   * Add filter condition
   * 
   * @param field - Field name
   * @param operatorOrValue - Operator string or FilterValue or direct value
   * @param value - Value (optional if using FilterValue)
   * @returns Query builder instance (chainable)
   * 
   * @example
   * ```typescript
   * // String operator
   * query.where('status', 'eq', 'active')
   * 
   * // FilterValue helper
   * query.where('age', gte(18))
   * 
   * // Shorthand (defaults to 'eq')
   * query.where('status', 'active')
   * ```
   */
  where(
    field: string, 
    operatorOrValue: FilterOperator | string | FilterValue | any, 
    value?: any
  ): this {
    // Case 1: where('field', filterValue)
    if (typeof operatorOrValue === 'object' && 'operator' in operatorOrValue) {
      const filterValue = operatorOrValue as FilterValue;
      this.filters.push({
        field,
        operator: filterValue.operator,
        value: filterValue.value
      });
      return this;
    }
    
    // Case 2: where('field', 'operator', value)
    if (value !== undefined) {
      this.filters.push({
        field,
        operator: operatorOrValue as FilterOperator | string,
        value
      });
      return this;
    }
    
    // Case 3: where('field', value) - defaults to 'eq'
    this.filters.push({
      field,
      operator: FilterOperator.EQUALS,
      value: operatorOrValue
    });
    
    return this;
  }
  
  /**
   * Alias for where with 'eq' operator
   * 
   * @param field - Field name
   * @param value - Value
   * @returns Query builder instance (chainable)
   */
  filter(field: string, value: any): this {
    return this.where(field, FilterOperator.EQUALS, value);
  }
  
  /**
   * Add search term
   * 
   * @param term - Search term
   * @returns Query builder instance (chainable)
   */
  search(term: string): this {
    this.searchTerm = term;
    return this;
  }
  
  /**
   * Alias for search
   */
  q(term: string): this {
    return this.search(term);
  }
  
  /**
   * Set page number
   * 
   * @param page - Page number (1-based)
   * @returns Query builder instance (chainable)
   */
  page(page: number): this {
    this.pageNum = page;
    return this;
  }
  
  /**
   * Set items per page
   * 
   * @param limit - Items per page
   * @returns Query builder instance (chainable)
   */
  limit(limit: number): this {
    this.limitNum = limit;
    return this;
  }
  
  /**
   * Alias for limit
   */
  perPage(limit: number): this {
    return this.limit(limit);
  }
  
  /**
   * Set offset
   * 
   * @param offset - Number of items to skip
   * @returns Query builder instance (chainable)
   */
  offset(offset: number): this {
    this.offsetNum = offset;
    return this;
  }
  
  /**
   * Add sort
   * 
   * @param field - Field to sort by
   * @param direction - Sort direction ('asc' or 'desc')
   * @returns Query builder instance (chainable)
   */
  sort(field: string, direction: SortDirection = 'asc'): this {
    this.sorts.push({ field, direction });
    return this;
  }
  
  /**
   * Alias for sort
   */
  orderBy(field: string, direction: SortDirection = 'asc'): this {
    return this.sort(field, direction);
  }
  
  /**
   * Add custom parameter
   * 
   * @param key - Parameter key
   * @param value - Parameter value
   * @returns Query builder instance (chainable)
   */
  param(key: string, value: any): this {
    this.customParams[key] = value;
    return this;
  }
  
  /**
   * Add multiple custom parameters
   *
   * @param params - Parameters object
   * @returns Query builder instance (chainable)
   */
  params(params: Record<string, any>): this {
    this.customParams = { ...this.customParams, ...params };
    return this;
  }

  /**
   * Add custom header
   *
   * @param key - Header key
   * @param value - Header value
   * @returns Query builder instance (chainable)
   */
  header(key: string, value: string): this {
    this.customHeaders[key] = value;
    return this;
  }

  /**
   * Add multiple custom headers
   *
   * @param headers - Headers object
   * @returns Query builder instance (chainable)
   */
  headers(headers: Record<string, string>): this {
    this.customHeaders = { ...this.customHeaders, ...headers };
    return this;
  }

  /**
   * Build query parameters object
   *
   * @returns Query parameters
   */
  private buildParams(): QueryParams {
    const params: QueryParams = {};

    // Add search term
    if (this.searchTerm) {
      params.q = this.searchTerm;
    }

    // Add filters
    if (this.filters.length > 0) {
      const filterParams = buildFilterParams(this.filters);
      Object.assign(params, filterParams);
    }

    // Add pagination
    if (this.pageNum !== undefined) {
      params.page = this.pageNum;
    }
    if (this.limitNum !== undefined) {
      params.limit = this.limitNum;
    }
    if (this.offsetNum !== undefined) {
      params.offset = this.offsetNum;
    }

    // Add sorting
    if (this.sorts.length > 0) {
      if (this.sorts.length === 1) {
        params.sort = this.sorts[0].field;
        params.order = this.sorts[0].direction;
      } else {
        // Multiple sorts
        params.sort = this.sorts.map(s => s.field).join(',');
        params.order = this.sorts.map(s => s.direction).join(',') as any;
      }
    }

    // Add custom params
    Object.assign(params, this.customParams);

    return params;
  }

  /**
   * Build query string
   *
   * @returns Query string (with leading ?)
   */
  toQueryString(): string {
    const params = this.buildParams();
    return buildQueryString(params);
  }

  /**
   * Build full URL
   *
   * @returns Full URL with query string
   */
  toURL(): string {
    const queryString = this.toQueryString();
    return `${this.endpoint}${queryString}`;
  }

  /**
   * Alias for toURL
   */
  build(): string {
    return this.toURL();
  }

  /**
   * Execute GET request
   *
   * @returns API response
   */
  async get<T = any>(): Promise<ApiResponse<T>> {
    const options: RequestOptions = {
      params: this.buildParams(),
      headers: this.customHeaders
    };

    return this.client.get<T>(this.endpoint, options);
  }

  /**
   * Execute POST request
   *
   * @param body - Request body
   * @returns API response
   */
  async post<T = any>(body?: any): Promise<ApiResponse<T>> {
    const options: RequestOptions = {
      params: this.buildParams(),
      headers: this.customHeaders
    };

    return this.client.post<T>(this.endpoint, body, options);
  }

  /**
   * Execute PUT request
   *
   * @param body - Request body
   * @returns API response
   */
  async put<T = any>(body?: any): Promise<ApiResponse<T>> {
    const options: RequestOptions = {
      params: this.buildParams(),
      headers: this.customHeaders
    };

    return this.client.put<T>(this.endpoint, body, options);
  }

  /**
   * Execute PATCH request
   *
   * @param body - Request body
   * @returns API response
   */
  async patch<T = any>(body?: any): Promise<ApiResponse<T>> {
    const options: RequestOptions = {
      params: this.buildParams(),
      headers: this.customHeaders
    };

    return this.client.patch<T>(this.endpoint, body, options);
  }

  /**
   * Execute DELETE request
   *
   * @returns API response
   */
  async delete<T = any>(): Promise<ApiResponse<T>> {
    const options: RequestOptions = {
      params: this.buildParams(),
      headers: this.customHeaders
    };

    return this.client.delete<T>(this.endpoint, options);
  }
}

