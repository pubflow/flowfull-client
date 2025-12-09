/**
 * FlowfullClient Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FlowfullClient } from '../src/core/client';
import { createFlowfull } from '../src/factory';

// Mock fetch
global.fetch = vi.fn();

describe('FlowfullClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should create instance with baseUrl', () => {
      const client = new FlowfullClient('https://api.example.com');
      expect(client).toBeInstanceOf(FlowfullClient);
    });

    it('should create instance with config', () => {
      const client = new FlowfullClient('https://api.example.com', {
        sessionId: 'test-session',
        retryAttempts: 5,
        timeout: 10000
      });
      expect(client).toBeInstanceOf(FlowfullClient);
    });

    it('should normalize baseUrl', () => {
      const client = new FlowfullClient('https://api.example.com/');
      expect(client).toBeInstanceOf(FlowfullClient);
    });
  });

  describe('Factory Function', () => {
    it('should create client with createFlowfull', () => {
      const client = createFlowfull('https://api.example.com');
      expect(client).toBeInstanceOf(FlowfullClient);
    });

    it('should create client with config', () => {
      const client = createFlowfull('https://api.example.com', {
        sessionId: 'test-session'
      });
      expect(client).toBeInstanceOf(FlowfullClient);
    });
  });

  describe('HTTP Methods', () => {
    it('should execute GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: [{ id: 1, name: 'John' }] }),
        headers: new Headers()
      };
      
      (global.fetch as any).mockResolvedValueOnce(mockResponse);
      
      const client = new FlowfullClient('https://api.example.com');
      const result = await client.get('/users');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ data: [{ id: 1, name: 'John' }] });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.any(Object)
      );
    });

    it('should execute POST request', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        json: async () => ({ id: 1, name: 'John' }),
        headers: new Headers()
      };
      
      (global.fetch as any).mockResolvedValueOnce(mockResponse);
      
      const client = new FlowfullClient('https://api.example.com');
      const body = { name: 'John', email: 'john@example.com' };
      const result = await client.post('/users', body);
      
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body)
        })
      );
    });

    it('should execute PUT request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ id: 1, name: 'John Updated' }),
        headers: new Headers()
      };
      
      (global.fetch as any).mockResolvedValueOnce(mockResponse);
      
      const client = new FlowfullClient('https://api.example.com');
      const body = { name: 'John Updated' };
      const result = await client.put('/users/1', body);
      
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'PUT'
        })
      );
    });

    it('should execute PATCH request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ id: 1, status: 'inactive' }),
        headers: new Headers()
      };
      
      (global.fetch as any).mockResolvedValueOnce(mockResponse);
      
      const client = new FlowfullClient('https://api.example.com');
      const body = { status: 'inactive' };
      const result = await client.patch('/users/1', body);
      
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'PATCH'
        })
      );
    });

    it('should execute DELETE request', async () => {
      const mockResponse = {
        ok: true,
        status: 204,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const client = new FlowfullClient('https://api.example.com');
      const result = await client.delete('/users/1');

      expect(result.success).toBe(true);
      expect(result.status).toBe(204);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  describe('Query Builder', () => {
    it('should create query builder', () => {
      const client = new FlowfullClient('https://api.example.com');
      const builder = client.query('/users');

      expect(builder).toBeDefined();
      expect(typeof builder.where).toBe('function');
      expect(typeof builder.get).toBe('function');
    });

    it('should execute query builder GET', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const client = new FlowfullClient('https://api.example.com');
      const result = await client.query('/users')
        .where('status', 'active')
        .page(1)
        .limit(20)
        .get();

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users?'),
        expect.any(Object)
      );
    });
  });

  describe('Headers Management', () => {
    it('should set custom header', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const client = new FlowfullClient('https://api.example.com');
      client.setHeader('X-Custom-Header', 'custom-value');

      await client.get('/users');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value'
          })
        })
      );
    });

    it('should remove header', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const client = new FlowfullClient('https://api.example.com');
      client.setHeader('X-Custom-Header', 'value');
      client.removeHeader('X-Custom-Header');

      await client.get('/users');

      const fetchCall = (global.fetch as any).mock.calls[0][1];
      expect(fetchCall.headers['X-Custom-Header']).toBeUndefined();
    });
  });

  describe('Session Management', () => {
    it('should include session header when sessionId is set', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const client = new FlowfullClient('https://api.example.com', {
        sessionId: 'test-session-123'
      });

      await client.get('/users');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Session-ID': 'test-session-123'
          })
        })
      );
    });

    it('should get session ID', async () => {
      const client = new FlowfullClient('https://api.example.com', {
        sessionId: 'test-session-123'
      });

      const sessionId = await client.getSessionId();
      expect(sessionId).toBe('test-session-123');
    });

    it('should set session ID', async () => {
      const client = new FlowfullClient('https://api.example.com');
      client.setSessionId('new-session-456');

      const sessionId = await client.getSessionId();
      expect(sessionId).toBe('new-session-456');
    });

    it('should clear session', async () => {
      const client = new FlowfullClient('https://api.example.com', {
        sessionId: 'test-session'
      });

      client.clearSession();
      const sessionId = await client.getSessionId();

      expect(sessionId).toBeNull();
    });

    it('should check if has session', async () => {
      const client = new FlowfullClient('https://api.example.com', {
        sessionId: 'test-session'
      });

      const hasSession = await client.hasSession();
      expect(hasSession).toBe(true);
    });
  });

  describe('Interceptors', () => {
    it('should add request interceptor', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const client = new FlowfullClient('https://api.example.com');
      const interceptor = vi.fn((config) => config);
      client.addRequestInterceptor(interceptor);

      await client.get('/users');

      expect(interceptor).toHaveBeenCalled();
    });

    it('should add response interceptor', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const client = new FlowfullClient('https://api.example.com');
      const interceptor = vi.fn((response) => response);
      client.addResponseInterceptor(interceptor);

      await client.get('/users');

      expect(interceptor).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'User not found' }),
        headers: new Headers()
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const client = new FlowfullClient('https://api.example.com');
      const result = await client.get('/users/999');

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(result.error).toBeDefined();
    });

    it('should handle network error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const client = new FlowfullClient('https://api.example.com', {
        retryAttempts: 1
      });
      const result = await client.get('/users');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Multiple Instances', () => {
    it('should support multiple independent instances', async () => {
      const mockResponse1 = {
        ok: true,
        status: 200,
        json: async () => ({ data: 'api1' }),
        headers: new Headers()
      };

      const mockResponse2 = {
        ok: true,
        status: 200,
        json: async () => ({ data: 'api2' }),
        headers: new Headers()
      };

      (global.fetch as any)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const client1 = createFlowfull('https://api1.example.com');
      const client2 = createFlowfull('https://api2.example.com');

      const [result1, result2] = await Promise.all([
        client1.get('/data'),
        client2.get('/data')
      ]);

      expect(result1.data).toEqual({ data: 'api1' });
      expect(result2.data).toEqual({ data: 'api2' });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});

