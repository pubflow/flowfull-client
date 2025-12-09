/**
 * QueryBuilder Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { QueryBuilder } from '../src/core/query-builder';
import { eq, gte, lt, like, inOp, isNull, between } from '../src/operators';
import { ApiResponse } from '../src/types';

// Mock client
const createMockClient = () => ({
  get: vi.fn(async () => ({ success: true, data: [] as any, status: 200 } as ApiResponse)),
  post: vi.fn(async () => ({ success: true, data: {} as any, status: 201 } as ApiResponse)),
  put: vi.fn(async () => ({ success: true, data: {} as any, status: 200 } as ApiResponse)),
  patch: vi.fn(async () => ({ success: true, data: {} as any, status: 200 } as ApiResponse)),
  delete: vi.fn(async () => ({ success: true, status: 204 } as ApiResponse))
});

describe('QueryBuilder', () => {
  describe('Constructor', () => {
    it('should create instance with client and endpoint', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      expect(builder).toBeInstanceOf(QueryBuilder);
    });
  });

  describe('where()', () => {
    it('should add filter with operator string', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder.where('status', 'eq', 'active');
      const url = builder.toURL();
      
      expect(url).toContain('status=active');
    });

    it('should add filter with FilterValue helper', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder.where('age', gte(18));
      const url = builder.toURL();
      
      expect(url).toContain('age_gte=18');
    });

    it('should add filter with shorthand (defaults to eq)', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder.where('status', 'active');
      const url = builder.toURL();
      
      expect(url).toContain('status=active');
    });

    it('should chain multiple filters', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder
        .where('status', 'active')
        .where('age', gte(18))
        .where('role', 'admin');
      
      const url = builder.toURL();
      
      expect(url).toContain('status=active');
      expect(url).toContain('age_gte=18');
      expect(url).toContain('role=admin');
    });

    it('should handle comparison operators', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/products');
      
      builder
        .where('price', 'gt', 50)
        .where('stock', 'gte', 10)
        .where('rating', 'lt', 5)
        .where('discount', 'lte', 20);
      
      const url = builder.toURL();
      
      expect(url).toContain('price_gt=50');
      expect(url).toContain('stock_gte=10');
      expect(url).toContain('rating_lt=5');
      expect(url).toContain('discount_lte=20');
    });

    it('should handle string operators', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder
        .where('name', like('john'))
        .where('email', 'endsWith', '@gmail.com');
      
      const url = builder.toURL();
      
      expect(url).toContain('name_like=john');
      expect(url).toContain('email_ew=%40gmail.com');
    });

    it('should handle array operators', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder.where('status', inOp(['active', 'pending', 'verified']));
      const url = builder.toURL();
      
      expect(url).toContain('status_in=active%2Cpending%2Cverified');
    });

    it('should handle null operators', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder.where('deleted_at', isNull());
      const url = builder.toURL();
      
      expect(url).toContain('deleted_at_null=true');
    });

    it('should handle range operators', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/products');
      
      builder.where('price', between(10, 100));
      const url = builder.toURL();
      
      expect(url).toContain('price_min=10');
      expect(url).toContain('price_max=100');
    });
  });

  describe('filter()', () => {
    it('should add filter with eq operator', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder.filter('status', 'active');
      const url = builder.toURL();
      
      expect(url).toContain('status=active');
    });

    it('should be chainable', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      const result = builder.filter('status', 'active');
      expect(result).toBe(builder);
    });
  });

  describe('search()', () => {
    it('should add search term', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');
      
      builder.search('john');
      const url = builder.toURL();
      
      expect(url).toContain('q=john');
    });

    it('should be aliased as q()', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.q('john');
      const url = builder.toURL();

      expect(url).toContain('q=john');
    });
  });

  describe('Pagination', () => {
    it('should add page number', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.page(2);
      const url = builder.toURL();

      expect(url).toContain('page=2');
    });

    it('should add limit', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.limit(20);
      const url = builder.toURL();

      expect(url).toContain('limit=20');
    });

    it('should add offset', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.offset(40);
      const url = builder.toURL();

      expect(url).toContain('offset=40');
    });

    it('should support perPage alias', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.perPage(25);
      const url = builder.toURL();

      expect(url).toContain('limit=25');
    });

    it('should combine page and limit', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.page(3).limit(15);
      const url = builder.toURL();

      expect(url).toContain('page=3');
      expect(url).toContain('limit=15');
    });
  });

  describe('Sorting', () => {
    it('should add single sort', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.sort('name', 'asc');
      const url = builder.toURL();

      expect(url).toContain('sort=name');
      expect(url).toContain('order=asc');
    });

    it('should default to asc direction', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.sort('name');
      const url = builder.toURL();

      expect(url).toContain('order=asc');
    });

    it('should support orderBy alias', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.orderBy('created_at', 'desc');
      const url = builder.toURL();

      expect(url).toContain('sort=created_at');
      expect(url).toContain('order=desc');
    });

    it('should handle multiple sorts', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.sort('status', 'asc').sort('name', 'asc');
      const url = builder.toURL();

      expect(url).toContain('sort=status%2Cname');
      expect(url).toContain('order=asc%2Casc');
    });
  });

  describe('Custom Parameters', () => {
    it('should add single custom param', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.param('include', 'profile');
      const url = builder.toURL();

      expect(url).toContain('include=profile');
    });

    it('should add multiple custom params', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.params({
        include: 'profile,settings',
        fields: 'id,name,email',
        expand: 'organization'
      });

      const url = builder.toURL();

      expect(url).toContain('include=profile%2Csettings');
      expect(url).toContain('fields=id%2Cname%2Cemail');
      expect(url).toContain('expand=organization');
    });
  });

  describe('Custom Headers', () => {
    it('should add single custom header', async () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.header('X-Custom-Header', 'value');
      await builder.get();

      expect(client.get).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          headers: { 'X-Custom-Header': 'value' }
        })
      );
    });

    it('should add multiple custom headers', async () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.headers({
        'X-API-Version': 'v2',
        'X-Client-ID': 'web-app'
      });

      await builder.get();

      expect(client.get).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          headers: {
            'X-API-Version': 'v2',
            'X-Client-ID': 'web-app'
          }
        })
      );
    });
  });

  describe('Build Methods', () => {
    it('should build query string', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder
        .where('status', 'active')
        .page(2)
        .limit(20)
        .sort('name', 'asc');

      const queryString = builder.toQueryString();

      expect(queryString).toContain('status=active');
      expect(queryString).toContain('page=2');
      expect(queryString).toContain('limit=20');
      expect(queryString).toContain('sort=name');
    });

    it('should build full URL', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.where('status', 'active');
      const url = builder.toURL();

      expect(url).toBe('/users?status=active');
    });

    it('should build URL without query params', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      const url = builder.toURL();

      expect(url).toBe('/users');
    });

    it('should build query params object', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder
        .where('status', 'active')
        .page(2)
        .limit(20);

      const queryString = builder.build();

      expect(queryString).toContain('status=active');
      expect(queryString).toContain('page=2');
      expect(queryString).toContain('limit=20');
    });
  });

  describe('HTTP Methods', () => {
    it('should execute GET request', async () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.where('status', 'active');
      await builder.get();

      expect(client.get).toHaveBeenCalledWith('/users?status=active', {});
    });

    it('should execute POST request', async () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      const body = { name: 'John', email: 'john@example.com' };
      await builder.post(body);

      expect(client.post).toHaveBeenCalledWith('/users', body, {});
    });

    it('should execute PUT request', async () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users/123');

      const body = { name: 'John Updated' };
      await builder.put(body);

      expect(client.put).toHaveBeenCalledWith('/users/123', body, {});
    });

    it('should execute PATCH request', async () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users/123');

      const body = { status: 'inactive' };
      await builder.patch(body);

      expect(client.patch).toHaveBeenCalledWith('/users/123', body, {});
    });

    it('should execute DELETE request', async () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users/123');

      await builder.delete();

      expect(client.delete).toHaveBeenCalledWith('/users/123', {});
    });

    it('should pass custom headers to HTTP methods', async () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/users');

      builder.header('X-Custom', 'value');
      await builder.get();

      expect(client.get).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          headers: { 'X-Custom': 'value' }
        })
      );
    });
  });

  describe('Complex Queries', () => {
    it('should build complex query with all features', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/products');

      builder
        .search('laptop')
        .where('status', inOp(['active', 'featured']))
        .where('price', between(500, 2000))
        .where('stock', gte(1))
        .where('verified_at', isNull())
        .sort('price', 'asc')
        .page(1)
        .limit(20)
        .param('include', 'images,reviews');

      const url = builder.toURL();

      expect(url).toContain('q=laptop');
      expect(url).toContain('status_in=active%2Cfeatured');
      expect(url).toContain('price_min=500');
      expect(url).toContain('price_max=2000');
      expect(url).toContain('stock_gte=1');
      expect(url).toContain('verified_at_null=true');
      expect(url).toContain('sort=price');
      expect(url).toContain('order=asc');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=20');
      expect(url).toContain('include=images%2Creviews');
    });

    it('should handle multiple filters on same field', () => {
      const client = createMockClient();
      const builder = new QueryBuilder(client, '/products');

      builder
        .where('price', gte(50))
        .where('price', lt(200));

      const url = builder.toURL();

      expect(url).toContain('price_gte=50');
      expect(url).toContain('price_lt=200');
    });
  });

  describe('Method Chaining', () => {
    it('should support full method chaining', () => {
      const client = createMockClient();

      const builder = new QueryBuilder(client, '/users')
        .where('status', 'active')
        .where('age', gte(18))
        .search('john')
        .page(1)
        .limit(20)
        .sort('name', 'asc')
        .param('include', 'profile');

      expect(builder).toBeInstanceOf(QueryBuilder);

      const url = builder.toURL();
      expect(url).toContain('status=active');
      expect(url).toContain('age_gte=18');
      expect(url).toContain('q=john');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=20');
      expect(url).toContain('sort=name');
      expect(url).toContain('include=profile');
    });
  });
});

