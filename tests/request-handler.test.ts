/**
 * RequestHandler Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RequestHandler } from '../src/core/request-handler';
import { RequestConfig } from '../src/types';

// Mock fetch
global.fetch = vi.fn();

describe('RequestHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should create instance with default config', () => {
      const handler = new RequestHandler();
      expect(handler).toBeInstanceOf(RequestHandler);
    });

    it('should create instance with custom retry config', () => {
      const handler = new RequestHandler({
        attempts: 5,
        delay: 2000,
        exponentialBackoff: false
      });
      expect(handler).toBeInstanceOf(RequestHandler);
    });
  });

  describe('request()', () => {
    it('should execute successful request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ data: 'test' }),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const handler = new RequestHandler();
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {}
      };

      const result = await handler.request(config);

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ data: 'test' });
    });

    it('should handle HTTP error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Not found' }),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const handler = new RequestHandler();
      const config: RequestConfig = {
        url: 'https://api.example.com/users/999',
        method: 'GET',
        headers: {}
      };

      const result = await handler.request(config);

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(result.error).toBeDefined();
    });

    it('should handle network error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const handler = new RequestHandler({ attempts: 1 });
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {}
      };

      const result = await handler.request(config);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should include headers in request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const handler = new RequestHandler();
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer token123',
          'X-Custom-Header': 'value'
        }
      };

      await handler.request(config);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer token123',
            'X-Custom-Header': 'value'
          })
        })
      );
    });

    it('should include body in POST request', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        json: async () => ({ id: 1 }),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const handler = new RequestHandler();
      const body = { name: 'John', email: 'john@example.com' };
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: {},
        body
      };

      await handler.request(config);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body)
        })
      );
    });

    it('should handle timeout', async () => {
      (global.fetch as any).mockImplementationOnce(() =>
        new Promise((resolve) => setTimeout(resolve, 10000))
      );

      const handler = new RequestHandler({ attempts: 1 });
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        timeout: 100
      };

      const result = await handler.request(config);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Retry Logic', () => {
    it('should retry on network error', async () => {
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: 'success' }),
          headers: new Headers()
        });

      const handler = new RequestHandler({ attempts: 3, delay: 10 });
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {}
      };

      const result = await handler.request(config);

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry on 4xx errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Invalid data' }),
        headers: new Headers()
      });

      const handler = new RequestHandler({ attempts: 3 });
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: {}
      };

      const result = await handler.request(config);

      expect(result.success).toBe(false);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on 5xx errors', async () => {
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ error: 'Server error' }),
          headers: new Headers()
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: 'success' }),
          headers: new Headers()
        });

      const handler = new RequestHandler({ attempts: 3, delay: 10 });
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {}
      };

      const result = await handler.request(config);

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should respect max retry attempts', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const handler = new RequestHandler({ attempts: 3, delay: 10 });
      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {}
      };

      const result = await handler.request(config);

      expect(result.success).toBe(false);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Interceptors', () => {
    it('should call request interceptor', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const handler = new RequestHandler();
      const interceptor = vi.fn((config) => config);
      handler.addRequestInterceptor(interceptor);

      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {}
      };

      await handler.request(config);

      expect(interceptor).toHaveBeenCalledWith(config);
    });

    it('should call response interceptor', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const handler = new RequestHandler();
      const interceptor = vi.fn((response) => response);
      handler.addResponseInterceptor(interceptor);

      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {}
      };

      await handler.request(config);

      expect(interceptor).toHaveBeenCalled();
    });

    it('should allow request interceptor to modify config', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const handler = new RequestHandler();
      handler.addRequestInterceptor((config) => ({
        ...config,
        headers: {
          ...config.headers,
          'X-Added-Header': 'interceptor-value'
        }
      }));

      const config: RequestConfig = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {}
      };

      await handler.request(config);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Added-Header': 'interceptor-value'
          })
        })
      );
    });
  });
});

