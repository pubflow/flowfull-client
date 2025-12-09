# 🔨 Query Builder Guide

The Query Builder is the heart of Flowfull Client. It provides a **chainable, fluent API** for building complex queries with ease.

---

## 🎯 Basic Concept

Instead of manually constructing query strings, you chain methods together:

```typescript
// ❌ Manual way (error-prone)
const url = '/products?status=active&price_gte=50&page=1&limit=20&sort=price&order=asc';

// ✅ Query Builder way (clean and type-safe)
const response = await api
  .query('/products')
  .where('status', 'active')
  .where('price', 'gte', 50)
  .page(1)
  .limit(20)
  .sort('price', 'asc')
  .get();
```

---

## 🚀 Creating a Query

Start a query with the `query()` method:

```typescript
const builder = api.query('/endpoint');
```

---

## 🔍 Filtering

### Basic Filters

Use `where()` to add filters:

```typescript
// Simple equality
api.query('/users')
  .where('status', 'active')
  .get();

// With operator
api.query('/users')
  .where('age', 'gte', 18)
  .get();

// With filter helper
import { gte } from '@pubflow/flowfull-client';

api.query('/users')
  .where('age', gte(18))
  .get();
```

### Multiple Filters

Chain multiple `where()` calls:

```typescript
api.query('/products')
  .where('status', 'active')
  .where('price', 'gte', 50)
  .where('price', 'lte', 200)
  .where('stock', 'gt', 0)
  .get();
```

### Filter Shorthand

Use `filter()` as a shorthand for equality:

```typescript
// These are equivalent
api.query('/users').where('status', 'active').get();
api.query('/users').filter('status', 'active').get();
```

---

## 🔎 Search

Add full-text search with `search()` or `q()`:

```typescript
// Search for products
api.query('/products')
  .search('laptop')
  .get();

// Shorthand
api.query('/products')
  .q('laptop')
  .get();

// Combine with filters
api.query('/products')
  .search('laptop')
  .where('price', 'lte', 1000)
  .get();
```

---

## 📄 Pagination

### Page-Based Pagination

```typescript
// Get page 2 with 25 items per page
api.query('/users')
  .page(2)
  .limit(25)
  .get();

// Alternative: perPage() alias
api.query('/users')
  .page(2)
  .perPage(25)
  .get();
```

### Offset-Based Pagination

```typescript
// Skip first 50 items, get next 25
api.query('/users')
  .offset(50)
  .limit(25)
  .get();
```

### Pagination Response

```typescript
const response = await api
  .query('/users')
  .page(1)
  .limit(20)
  .get();

if (response.success && response.meta) {
  console.log(`Page ${response.meta.page} of ${response.meta.totalPages}`);
  console.log(`Total items: ${response.meta.total}`);
  console.log(`Has more: ${response.meta.hasMore}`);
}
```

---

## 📊 Sorting

### Single Sort

```typescript
// Sort by name ascending
api.query('/users')
  .sort('name', 'asc')
  .get();

// Sort by created_at descending
api.query('/users')
  .sort('created_at', 'desc')
  .get();

// Default direction is 'asc'
api.query('/users')
  .sort('name')
  .get();
```

### Multiple Sorts

```typescript
// Sort by status (asc), then by name (asc)
api.query('/users')
  .sort('status', 'asc')
  .sort('name', 'asc')
  .get();
```

### OrderBy Alias

```typescript
// These are equivalent
api.query('/users').sort('name', 'asc').get();
api.query('/users').orderBy('name', 'asc').get();
```

---

## ⚙️ Custom Parameters

Add custom query parameters:

```typescript
// Single parameter
api.query('/users')
  .param('include', 'profile')
  .get();

// Multiple parameters
api.query('/users')
  .params({
    include: 'profile,settings',
    fields: 'id,name,email',
    expand: 'organization'
  })
  .get();
```

---

## 📋 Custom Headers

Add custom headers to your request:

```typescript
// Single header
api.query('/users')
  .header('X-API-Version', 'v2')
  .get();

// Multiple headers
api.query('/users')
  .headers({
    'X-API-Version': 'v2',
    'X-Client-ID': 'web-app',
    'X-Request-ID': 'abc123'
  })
  .get();
```

---

## 🔨 Building Queries

### Get Query String

```typescript
const builder = api.query('/users')
  .where('status', 'active')
  .page(1)
  .limit(20);

const queryString = builder.toQueryString();
// "status=active&page=1&limit=20"
```

### Get Full URL

```typescript
const url = builder.toURL();
// "/users?status=active&page=1&limit=20"
```

### Build Query Object

```typescript
const queryString = builder.build();
// Returns the query string
```

---

## 🌐 Executing Requests

### GET Request

```typescript
const response = await api
  .query('/users')
  .where('status', 'active')
  .get();
```

### POST Request

```typescript
const body = { name: 'John', email: 'john@example.com' };

const response = await api
  .query('/users')
  .post(body);
```

### PUT Request

```typescript
const updates = { name: 'John Updated' };

const response = await api
  .query('/users/123')
  .put(updates);
```

### PATCH Request

```typescript
const response = await api
  .query('/users/123')
  .patch({ status: 'inactive' });
```

### DELETE Request

```typescript
const response = await api
  .query('/users/123')
  .delete();
```

---

## 🎨 Method Chaining

All methods return `this`, allowing you to chain them:

```typescript
const response = await api
  .query('/products')
  .search('laptop')
  .where('status', 'active')
  .where('price', 'gte', 500)
  .where('price', 'lte', 2000)
  .where('stock', 'gt', 0)
  .sort('price', 'asc')
  .page(1)
  .limit(20)
  .param('include', 'images,reviews')
  .header('X-API-Version', 'v2')
  .get();
```

---

## 💡 Real-World Examples

### E-commerce Product Listing

```typescript
const products = await api
  .query('/products')
  .search(searchTerm)
  .where('category', selectedCategory)
  .where('price', 'gte', minPrice)
  .where('price', 'lte', maxPrice)
  .where('in_stock', true)
  .sort(sortBy, sortDirection)
  .page(currentPage)
  .limit(itemsPerPage)
  .get();
```

### User Management Dashboard

```typescript
const users = await api
  .query('/users')
  .where('role', inOp(['admin', 'moderator']))
  .where('status', 'active')
  .where('verified_at', isNotNull())
  .where('created_at', 'gte', startDate)
  .where('created_at', 'lte', endDate)
  .sort('created_at', 'desc')
  .page(page)
  .limit(50)
  .param('include', 'profile,stats')
  .get();
```

### Order History

```typescript
const orders = await api
  .query('/orders')
  .where('user_id', userId)
  .where('status', inOp(['completed', 'shipped', 'delivered']))
  .where('total', 'gte', 100)
  .sort('created_at', 'desc')
  .limit(20)
  .param('include', 'items,shipping')
  .get();
```

### Analytics Query

```typescript
const stats = await api
  .query('/analytics/events')
  .where('event_type', 'purchase')
  .where('created_at', between(startDate, endDate))
  .where('amount', 'gte', 50)
  .param('group_by', 'date')
  .param('aggregate', 'sum,count,avg')
  .get();
```

---

## 🎯 Pro Tips

1. **Chain everything**: Every method returns `this` for chaining
2. **Type safety**: TypeScript will autocomplete all methods
3. **Reusable builders**: Save a builder and execute it multiple times
4. **Combine with operators**: Import filter operators for complex queries
5. **Debug queries**: Use `toURL()` to see the final query string

---

## 🔄 Reusing Queries

You can save a query builder and execute it multiple times:

```typescript
// Create a reusable query
const activeUsersQuery = api
  .query('/users')
  .where('status', 'active')
  .where('verified_at', isNotNull());

// Execute with different pagination
const page1 = await activeUsersQuery.page(1).limit(20).get();
const page2 = await activeUsersQuery.page(2).limit(20).get();
```

---

**Next:** [Configuration Guide](./configuration.md)

