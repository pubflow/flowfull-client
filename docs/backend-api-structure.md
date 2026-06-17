# 🏗️ Backend API Structure Guide

> **For Backend Developers**: How to structure your API to work seamlessly with Flowfull Client

This guide shows you how to build APIs that are **100% compatible** with Flowfull Client, making integration effortless for frontend developers.

---

## 🎯 Overview

Flowfull Client expects your API to follow certain conventions for:
- **Response format** - Consistent structure for all responses
- **Query parameters** - Standard parameter names for filtering, pagination, sorting
- **Filter operators** - How to handle the 14 filter operators
- **Search** - Full-text search parameter
- **Error handling** - Consistent error responses

Following these conventions makes your API **instantly compatible** with Flowfull Client's chainable query builder.

---

## 📦 Response Format

### Standard Success Response

All successful responses should follow this structure:

```typescript
{
  "success": true,
  "data": <your_data>,           // Array, object, or primitive
  "message": "Optional message",  // Optional success message
  "meta": {                       // Optional metadata
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

### Standard Error Response

All error responses should follow this structure:

```typescript
{
  "success": false,
  "error": "Error message",       // Human-readable error
  "message": "Additional context", // Optional additional info
  "code": "ERROR_CODE",           // Optional error code
  "status": 400                   // HTTP status code
}
```

---

## 🔍 Query Parameters Standard

### Pagination Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-based) | `?page=2` |
| `limit` | number | Items per page | `?limit=20` |
| `offset` | number | Number of items to skip | `?offset=40` |

**Example Request:**
```
GET /api/users?page=2&limit=20
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

### Sorting Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `sort` | string | Field to sort by | `?sort=name` |
| `order` | string | Sort direction (`asc` or `desc`) | `?order=desc` |

**Alternative format (recommended):**
```
?sort=name:asc
?sort=created_at:desc
```

**Multiple sorts:**
```
?sort=status:asc,created_at:desc
```

**Example Request:**
```
GET /api/products?sort=price:asc
```

### Search Parameter

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` or `search` | string | Full-text search term | `?q=laptop` |

**Example Request:**
```
GET /api/products?q=laptop&status=active
```

**Backend Implementation:**
```typescript
// Search across multiple fields
const searchTerm = req.query.q || req.query.search;
if (searchTerm) {
  query = query.where((builder) => {
    builder
      .where('name', 'ilike', `%${searchTerm}%`)
      .orWhere('description', 'ilike', `%${searchTerm}%`)
      .orWhere('sku', 'ilike', `%${searchTerm}%`);
  });
}
```

---

## 🔧 Filter Operators

Flowfull Client sends filters using these parameter formats:

### Comparison Operators

| Operator | Parameter Format | Example | SQL Equivalent |
|----------|-----------------|---------|----------------|
| `eq` (equals) | `field=value` | `?status=active` | `WHERE status = 'active'` |
| `ne` (not equals) | `field_ne=value` | `?status_ne=deleted` | `WHERE status != 'deleted'` |
| `gt` (greater than) | `field_gt=value` | `?age_gt=18` | `WHERE age > 18` |
| `gte` (greater/equal) | `field_gte=value` | `?age_gte=21` | `WHERE age >= 21` |
| `lt` (less than) | `field_lt=value` | `?price_lt=100` | `WHERE price < 100` |
| `lte` (less/equal) | `field_lte=value` | `?price_lte=50` | `WHERE price <= 50` |

**Example Request:**
```
GET /api/products?price_gte=50&price_lte=200
```

**Backend Implementation (Kysely):**
```typescript
if (req.query.price_gte) {
  query = query.where('price', '>=', Number(req.query.price_gte));
}
if (req.query.price_lte) {
  query = query.where('price', '<=', Number(req.query.price_lte));
}
```

### String Operators

| Operator | Parameter Format | Example | SQL Equivalent |
|----------|-----------------|---------|----------------|
| `like` | `field_like=value` | `?name_like=john` | `WHERE name LIKE '%john%'` |
| `ilike` | `field_ilike=value` | `?email_ilike=GMAIL` | `WHERE email ILIKE '%gmail%'` |
| `sw` (starts with) | `field_sw=value` | `?name_sw=Mr.` | `WHERE name LIKE 'Mr.%'` |
| `ew` (ends with) | `field_ew=value` | `?email_ew=@gmail.com` | `WHERE email LIKE '%@gmail.com'` |

**Example Request:**
```
GET /api/users?email_ew=@gmail.com
```

**Backend Implementation:**
```typescript
if (req.query.email_ew) {
  query = query.where('email', 'like', `%${req.query.email_ew}`);
}
if (req.query.name_sw) {
  query = query.where('name', 'like', `${req.query.name_sw}%`);
}
```

### Array Operators

| Operator | Parameter Format | Example | SQL Equivalent |
|----------|-----------------|---------|----------------|
| `in` | `field_in=val1,val2` | `?status_in=active,pending` | `WHERE status IN ('active','pending')` |
| `nin` (not in) | `field_nin=val1,val2` | `?role_nin=banned,deleted` | `WHERE role NOT IN ('banned','deleted')` |

**Example Request:**
```
GET /api/users?status_in=active,pending,verified
```

**Backend Implementation:**
```typescript
if (req.query.status_in) {
  const values = req.query.status_in.split(',');
  query = query.where('status', 'in', values);
}
if (req.query.role_nin) {
  const values = req.query.role_nin.split(',');
  query = query.where('role', 'not in', values);
}
```

### Null Operators

| Operator | Parameter Format | Example | SQL Equivalent |
|----------|-----------------|---------|----------------|
| `null` (is null) | `field_null=true` | `?deleted_at_null=true` | `WHERE deleted_at IS NULL` |
| `nnull` (not null) | `field_nnull=true` | `?verified_at_nnull=true` | `WHERE verified_at IS NOT NULL` |

**Example Request:**
```
GET /api/users?deleted_at_null=true&verified_at_nnull=true
```

**Backend Implementation:**
```typescript
if (req.query.deleted_at_null === 'true') {
  query = query.whereNull('deleted_at');
}
if (req.query.verified_at_nnull === 'true') {
  query = query.whereNotNull('verified_at');
}
```

### Range Operators

| Operator | Parameter Format | Example | SQL Equivalent |
|----------|-----------------|---------|----------------|
| `between` | `field_min=X&field_max=Y` | `?price_min=50&price_max=200` | `WHERE price BETWEEN 50 AND 200` |

**Example Request:**
```
GET /api/products?price_min=50&price_max=200
```

**Backend Implementation:**
```typescript
if (req.query.price_min && req.query.price_max) {
  query = query
    .where('price', '>=', Number(req.query.price_min))
    .where('price', '<=', Number(req.query.price_max));
}
```

---

## 🎯 Complete Backend Example

Here's a complete example of a backend route that supports all Flowfull Client features:

### Hono + Kysely Example

```typescript
import { Hono } from 'hono';
import { db } from './database';

const app = new Hono();

app.get('/api/products', async (c) => {
  try {
    let query = db.selectFrom('products');
    
    // === FILTERING ===
    
    // Simple equality
    if (c.req.query('status')) {
      query = query.where('status', '=', c.req.query('status'));
    }
    
    // Comparison operators
    if (c.req.query('price_gte')) {
      query = query.where('price', '>=', Number(c.req.query('price_gte')));
    }
    if (c.req.query('price_lte')) {
      query = query.where('price', '<=', Number(c.req.query('price_lte')));
    }
    if (c.req.query('stock_gt')) {
      query = query.where('stock', '>', Number(c.req.query('stock_gt')));
    }
    
    // String operators
    if (c.req.query('name_like')) {
      query = query.where('name', 'like', `%${c.req.query('name_like')}%`);
    }
    if (c.req.query('name_sw')) {
      query = query.where('name', 'like', `${c.req.query('name_sw')}%`);
    }
    if (c.req.query('email_ew')) {
      query = query.where('email', 'like', `%${c.req.query('email_ew')}`);
    }
    
    // Array operators
    if (c.req.query('category_in')) {
      const categories = c.req.query('category_in')!.split(',');
      query = query.where('category', 'in', categories);
    }
    if (c.req.query('status_nin')) {
      const statuses = c.req.query('status_nin')!.split(',');
      query = query.where('status', 'not in', statuses);
    }
    
    // Null operators
    if (c.req.query('deleted_at_null') === 'true') {
      query = query.whereNull('deleted_at');
    }
    if (c.req.query('featured_image_nnull') === 'true') {
      query = query.whereNotNull('featured_image');
    }
    
    // Range operators (between)
    if (c.req.query('price_min') && c.req.query('price_max')) {
      query = query
        .where('price', '>=', Number(c.req.query('price_min')))
        .where('price', '<=', Number(c.req.query('price_max')));
    }
    
    // === SEARCH ===
    const searchTerm = c.req.query('q') || c.req.query('search');
    if (searchTerm) {
      query = query.where((eb) =>
        eb.or([
          eb('name', 'ilike', `%${searchTerm}%`),
          eb('description', 'ilike', `%${searchTerm}%`),
          eb('sku', 'ilike', `%${searchTerm}%`)
        ])
      );
    }
    
    // === SORTING ===
    const sortField = c.req.query('sort') || 'created_at';
    const sortOrder = c.req.query('order') || 'desc';
    query = query.orderBy(sortField, sortOrder as 'asc' | 'desc');
    
    // === PAGINATION ===
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 20;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countQuery = query.clearSelect().select(db.fn.count('id').as('count'));
    const countResult = await countQuery.executeTakeFirst();
    const total = Number(countResult?.count || 0);
    
    // Get paginated data
    const products = await query
      .limit(limit)
      .offset(offset)
      .selectAll()
      .execute();
    
    // === RESPONSE ===
    return c.json({
      success: true,
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    }, 500);
  }
});
```

---

## 🔄 Reusable Query Parser

Create a reusable function to parse Flowfull Client queries:

```typescript
// utils/query-parser.ts
import { SelectQueryBuilder } from 'kysely';

export interface ParsedQuery {
  filters: Record<string, any>;
  search?: string;
  sort?: { field: string; order: 'asc' | 'desc' };
  pagination: { page: number; limit: number; offset: number };
}

export function parseFlowfullQuery(queryParams: Record<string, any>): ParsedQuery {
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 20;
  
  return {
    filters: extractFilters(queryParams),
    search: queryParams.q || queryParams.search,
    sort: {
      field: queryParams.sort || 'created_at',
      order: (queryParams.order || 'desc') as 'asc' | 'desc'
    },
    pagination: {
      page,
      limit,
      offset: (page - 1) * limit
    }
  };
}

function extractFilters(queryParams: Record<string, any>): Record<string, any> {
  const filters: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(queryParams)) {
    // Skip pagination, sorting, and search params
    if (['page', 'limit', 'offset', 'sort', 'order', 'q', 'search'].includes(key)) {
      continue;
    }
    
    filters[key] = value;
  }
  
  return filters;
}

export function applyFilters<DB, TB extends keyof DB>(
  query: SelectQueryBuilder<DB, TB, any>,
  filters: Record<string, any>
): SelectQueryBuilder<DB, TB, any> {
  let result = query;
  
  for (const [key, value] of Object.entries(filters)) {
    // Comparison operators
    if (key.endsWith('_ne')) {
      const field = key.slice(0, -3);
      result = result.where(field as any, '!=', value);
    } else if (key.endsWith('_gt')) {
      const field = key.slice(0, -3);
      result = result.where(field as any, '>', Number(value));
    } else if (key.endsWith('_gte')) {
      const field = key.slice(0, -4);
      result = result.where(field as any, '>=', Number(value));
    } else if (key.endsWith('_lt')) {
      const field = key.slice(0, -3);
      result = result.where(field as any, '<', Number(value));
    } else if (key.endsWith('_lte')) {
      const field = key.slice(0, -4);
      result = result.where(field as any, '<=', Number(value));
    }
    // String operators
    else if (key.endsWith('_like')) {
      const field = key.slice(0, -5);
      result = result.where(field as any, 'like', `%${value}%`);
    } else if (key.endsWith('_ilike')) {
      const field = key.slice(0, -6);
      result = result.where(field as any, 'ilike', `%${value}%`);
    } else if (key.endsWith('_sw')) {
      const field = key.slice(0, -3);
      result = result.where(field as any, 'like', `${value}%`);
    } else if (key.endsWith('_ew')) {
      const field = key.slice(0, -3);
      result = result.where(field as any, 'like', `%${value}`);
    }
    // Array operators
    else if (key.endsWith('_in')) {
      const field = key.slice(0, -3);
      const values = value.split(',');
      result = result.where(field as any, 'in', values);
    } else if (key.endsWith('_nin')) {
      const field = key.slice(0, -4);
      const values = value.split(',');
      result = result.where(field as any, 'not in', values);
    }
    // Null operators
    else if (key.endsWith('_null') && value === 'true') {
      const field = key.slice(0, -5);
      result = result.whereNull(field as any);
    } else if (key.endsWith('_nnull') && value === 'true') {
      const field = key.slice(0, -6);
      result = result.whereNotNull(field as any);
    }
    // Range operators (between)
    else if (key.endsWith('_min')) {
      const field = key.slice(0, -4);
      result = result.where(field as any, '>=', Number(value));
    } else if (key.endsWith('_max')) {
      const field = key.slice(0, -4);
      result = result.where(field as any, '<=', Number(value));
    }
    // Simple equality
    else {
      result = result.where(key as any, '=', value);
    }
  }
  
  return result;
}
```

### Using the Query Parser

```typescript
import { parseFlowfullQuery, applyFilters } from './utils/query-parser';

app.get('/api/products', async (c) => {
  const parsed = parseFlowfullQuery(c.req.query());
  
  let query = db.selectFrom('products');
  
  // Apply filters
  query = applyFilters(query, parsed.filters);
  
  // Apply search
  if (parsed.search) {
    query = query.where((eb) =>
      eb.or([
        eb('name', 'ilike', `%${parsed.search}%`),
        eb('description', 'ilike', `%${parsed.search}%`)
      ])
    );
  }
  
  // Apply sorting
  query = query.orderBy(parsed.sort.field as any, parsed.sort.order);
  
  // Get total
  const total = await query.clearSelect()
    .select(db.fn.count('id').as('count'))
    .executeTakeFirst();
  
  // Apply pagination
  const data = await query
    .limit(parsed.pagination.limit)
    .offset(parsed.pagination.offset)
    .selectAll()
    .execute();
  
  return c.json({
    success: true,
    data,
    meta: {
      page: parsed.pagination.page,
      limit: parsed.pagination.limit,
      total: Number(total?.count || 0),
      totalPages: Math.ceil(Number(total?.count || 0) / parsed.pagination.limit),
      hasMore: parsed.pagination.page < Math.ceil(Number(total?.count || 0) / parsed.pagination.limit)
    }
  });
});
```

---

## 📋 Quick Reference Checklist

When building an API endpoint, make sure to support:

### ✅ Response Format
- [ ] Return `{ success: true, data: ... }` on success
- [ ] Return `{ success: false, error: ... }` on error
- [ ] Include `meta` object for pagination

### ✅ Pagination
- [ ] Support `page` parameter (1-based)
- [ ] Support `limit` parameter
- [ ] Support `offset` parameter (optional)
- [ ] Return pagination metadata in `meta`

### ✅ Sorting
- [ ] Support `sort` parameter (field name)
- [ ] Support `order` parameter (`asc` or `desc`)

### ✅ Search
- [ ] Support `q` or `search` parameter
- [ ] Search across relevant fields

### ✅ Filter Operators
- [ ] Comparison: `field_gt`, `field_gte`, `field_lt`, `field_lte`, `field_ne`
- [ ] String: `field_like`, `field_ilike`, `field_sw`, `field_ew`
- [ ] Array: `field_in`, `field_nin`
- [ ] Null: `field_null`, `field_nnull`
- [ ] Range: `field_min`, `field_max`

---

## 💡 Best Practices

### 1. **Always Validate Input**

```typescript
// Validate pagination
const page = Math.max(1, Number(c.req.query('page')) || 1);
const limit = Math.min(100, Math.max(1, Number(c.req.query('limit')) || 20));

// Validate sort field (whitelist)
const allowedSortFields = ['name', 'price', 'created_at', 'updated_at'];
const sortField = allowedSortFields.includes(c.req.query('sort') || '')
  ? c.req.query('sort')
  : 'created_at';
```

### 2. **Sanitize Search Input**

```typescript
// Prevent SQL injection
const searchTerm = c.req.query('q')?.replace(/[%_]/g, '\\$&');
```

### 3. **Set Maximum Limits**

```typescript
// Prevent abuse
const MAX_LIMIT = 100;
const limit = Math.min(MAX_LIMIT, Number(c.req.query('limit')) || 20);
```

### 4. **Use Indexes**

Make sure your database has indexes on commonly filtered/sorted fields:

```sql
-- Add indexes for better performance
CREATE INDEX IF NOT EXIST idx_products_status ON products(status);
CREATE INDEX IF NOT EXIST idx_products_price ON products(price);
CREATE INDEX IF NOT EXIST idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXIST idx_products_category ON products(category);

-- Full-text search index
CREATE INDEX IF NOT EXIST idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || description));
```

### 5. **Cache Count Queries**

```typescript
// Cache total count for better performance
const cacheKey = `products:count:${JSON.stringify(filters)}`;
let total = await cache.get(cacheKey);

if (!total) {
  const countResult = await query.clearSelect()
    .select(db.fn.count('id').as('count'))
    .executeTakeFirst();
  total = Number(countResult?.count || 0);
  await cache.set(cacheKey, total, 300); // Cache for 5 minutes
}
```

### 6. **Return Consistent Errors**

```typescript
// Consistent error handling
try {
  // ... your code
} catch (error) {
  console.error('Error fetching products:', error);

  return c.json({
    success: false,
    error: 'Failed to fetch products',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    status: 500
  }, 500);
}
```

---

## 🎯 HTTP Method Guidelines

### GET Requests

**Purpose**: Retrieve data

**Response Format**:
```typescript
{
  success: true,
  data: [...],  // Array for lists, object for single item
  meta: {       // Include for lists
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}
```

**Example**:
```typescript
// List
app.get('/api/users', async (c) => {
  // ... apply filters, pagination, sorting
  return c.json({ success: true, data: users, meta: { ... } });
});

// Single item
app.get('/api/users/:id', async (c) => {
  const user = await db.selectFrom('users')
    .where('id', '=', c.req.param('id'))
    .selectAll()
    .executeTakeFirst();

  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }

  return c.json({ success: true, data: user });
});
```

### POST Requests

**Purpose**: Create new resource

**Response Format**:
```typescript
{
  success: true,
  data: { id: '123', ... },  // Created resource
  message: "User created successfully"
}
```

**Example**:
```typescript
app.post('/api/users', async (c) => {
  const body = await c.req.json();

  // Validate
  if (!body.email || !body.name) {
    return c.json({
      success: false,
      error: 'Email and name are required'
    }, 400);
  }

  // Create
  const user = await db.insertInto('users')
    .values({
      name: body.name,
      email: body.email,
      created_at: new Date()
    })
    .returningAll()
    .executeTakeFirst();

  return c.json({
    success: true,
    data: user,
    message: 'User created successfully'
  }, 201);
});
```

### PUT Requests

**Purpose**: Full update (replace entire resource)

**Response Format**:
```typescript
{
  success: true,
  data: { id: '123', ... },  // Updated resource
  message: "User updated successfully"
}
```

**Example**:
```typescript
app.put('/api/users/:id', async (c) => {
  const body = await c.req.json();

  const user = await db.updateTable('users')
    .set({
      name: body.name,
      email: body.email,
      updated_at: new Date()
    })
    .where('id', '=', c.req.param('id'))
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }

  return c.json({
    success: true,
    data: user,
    message: 'User updated successfully'
  });
});
```

### PATCH Requests

**Purpose**: Partial update (update specific fields)

**Response Format**:
```typescript
{
  success: true,
  data: { id: '123', ... },  // Updated resource
  message: "User updated successfully"
}
```

**Example**:
```typescript
app.patch('/api/users/:id', async (c) => {
  const body = await c.req.json();

  // Only update provided fields
  const updates: any = { updated_at: new Date() };
  if (body.name !== undefined) updates.name = body.name;
  if (body.email !== undefined) updates.email = body.email;
  if (body.status !== undefined) updates.status = body.status;

  const user = await db.updateTable('users')
    .set(updates)
    .where('id', '=', c.req.param('id'))
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }

  return c.json({
    success: true,
    data: user,
    message: 'User updated successfully'
  });
});
```

### DELETE Requests

**Purpose**: Delete resource

**Response Format**:
```typescript
{
  success: true,
  message: "User deleted successfully"
}
```

**Example**:
```typescript
app.delete('/api/users/:id', async (c) => {
  const result = await db.deleteFrom('users')
    .where('id', '=', c.req.param('id'))
    .executeTakeFirst();

  if (result.numDeletedRows === 0n) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }

  return c.json({
    success: true,
    message: 'User deleted successfully'
  });
});
```

---

## 🚀 Real-World Examples

### E-commerce Products API

```typescript
app.get('/api/products', async (c) => {
  let query = db.selectFrom('products');

  // Category filter
  if (c.req.query('category')) {
    query = query.where('category', '=', c.req.query('category'));
  }

  // Price range
  if (c.req.query('price_min')) {
    query = query.where('price', '>=', Number(c.req.query('price_min')));
  }
  if (c.req.query('price_max')) {
    query = query.where('price', '<=', Number(c.req.query('price_max')));
  }

  // In stock only
  if (c.req.query('in_stock') === 'true') {
    query = query.where('stock', '>', 0);
  }

  // Featured products
  if (c.req.query('featured') === 'true') {
    query = query.where('is_featured', '=', true);
  }

  // Search
  const search = c.req.query('q');
  if (search) {
    query = query.where((eb) =>
      eb.or([
        eb('name', 'ilike', `%${search}%`),
        eb('description', 'ilike', `%${search}%`),
        eb('sku', 'ilike', `%${search}%`)
      ])
    );
  }

  // Sorting
  const sort = c.req.query('sort') || 'created_at';
  const order = c.req.query('order') || 'desc';
  query = query.orderBy(sort as any, order as any);

  // Pagination
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 20;
  const offset = (page - 1) * limit;

  // Execute
  const [products, countResult] = await Promise.all([
    query.limit(limit).offset(offset).selectAll().execute(),
    query.clearSelect().select(db.fn.count('id').as('count')).executeTakeFirst()
  ]);

  const total = Number(countResult?.count || 0);

  return c.json({
    success: true,
    data: products,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit)
    }
  });
});
```

**Frontend Usage**:
```typescript
const products = await api
  .query('/products')
  .search('laptop')
  .where('category', 'electronics')
  .where('price_min', 500)
  .where('price_max', 2000)
  .where('in_stock', true)
  .sort('price', 'asc')
  .page(1)
  .limit(20)
  .get();
```

### User Management API

```typescript
app.get('/api/users', async (c) => {
  let query = db.selectFrom('users');

  // Status filter
  if (c.req.query('status')) {
    query = query.where('status', '=', c.req.query('status'));
  }

  // Role filter
  if (c.req.query('role_in')) {
    const roles = c.req.query('role_in')!.split(',');
    query = query.where('role', 'in', roles);
  }

  // Verified users only
  if (c.req.query('verified_at_nnull') === 'true') {
    query = query.whereNotNull('verified_at');
  }

  // Created date range
  if (c.req.query('created_at_gte')) {
    query = query.where('created_at', '>=', c.req.query('created_at_gte'));
  }
  if (c.req.query('created_at_lte')) {
    query = query.where('created_at', '<=', c.req.query('created_at_lte'));
  }

  // Search
  const search = c.req.query('q');
  if (search) {
    query = query.where((eb) =>
      eb.or([
        eb('name', 'ilike', `%${search}%`),
        eb('email', 'ilike', `%${search}%`)
      ])
    );
  }

  // Sorting
  query = query.orderBy(
    (c.req.query('sort') || 'created_at') as any,
    (c.req.query('order') || 'desc') as any
  );

  // Pagination
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 20;

  const [users, countResult] = await Promise.all([
    query.limit(limit).offset((page - 1) * limit).selectAll().execute(),
    query.clearSelect().select(db.fn.count('id').as('count')).executeTakeFirst()
  ]);

  return c.json({
    success: true,
    data: users,
    meta: {
      page,
      limit,
      total: Number(countResult?.count || 0),
      totalPages: Math.ceil(Number(countResult?.count || 0) / limit)
    }
  });
});
```

**Frontend Usage**:
```typescript
const users = await api
  .query('/users')
  .where('status', 'active')
  .where('role_in', ['admin', 'moderator'])
  .where('verified_at', isNotNull())
  .where('created_at', 'gte', '2024-01-01')
  .sort('created_at', 'desc')
  .page(1)
  .limit(50)
  .get();
```

---

## 📚 Additional Resources

- **[Flowfull Client Documentation](./README.md)** - Frontend integration guide
- **[Filter Operators](./filter-operators.md)** - Complete operator reference
- **[Query Builder](./query-builder.md)** - Frontend query building guide

---

**Made with ❤️ for backend developers**

