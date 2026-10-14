import type { FlowfullClient } from '../core/client';
import type { ApiResponse, RequestOptions } from '../types';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export function joinPath(prefix: string, path = ''): string {
  const cleanPrefix = `/${prefix}`.replace(/\/+/g, '/').replace(/\/$/, '');
  const cleanPath = path ? `/${path}`.replace(/\/+/g, '/') : '';
  return `${cleanPrefix}${cleanPath}`;
}

export class ModuleHelper {
  constructor(
    protected readonly client: FlowfullClient,
    protected readonly prefix: string
  ) {}

  protected path(path = ''): string {
    return joinPath(this.prefix, path);
  }

  get<T = any>(path = '', params?: QueryParams, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.client.get<T>(this.path(path), { ...options, params });
  }

  post<T = any>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.client.post<T>(this.path(path), body, options);
  }

  put<T = any>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.client.put<T>(this.path(path), body, options);
  }

  patch<T = any>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.client.patch<T>(this.path(path), body, options);
  }

  delete<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.client.delete<T>(this.path(path), options);
  }
}
