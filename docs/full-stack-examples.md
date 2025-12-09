# 🔄 Full-Stack Integration Examples

> **Complete examples** showing frontend (Flowfull Client) and backend (Hono + Kysely) working together

This guide shows you **complete, working examples** of frontend and backend code working together seamlessly.

---

## 📦 Example 1: Product Listing with Filters

### Backend (Hono + Kysely)

```typescript
// routes/products.ts
import { Hono } from 'hono';
import { db } from '../database';

const app = new Hono();

app.get('/products', async (c) => {
  let query = db.selectFrom('products');
  
  // === FILTERS ===
  
  // Category
  if (c.req.query('category')) {
    query = query.where('category', '=', c.req.query('category'));
  }
  
  // Status
  if (c.req.query('status')) {
    query = query.where('status', '=', c.req.query('status'));
  }
  
  // Price range
  if (c.req.query('price_gte')) {
    query = query.where('price', '>=', Number(c.req.query('price_gte')));
  }
  if (c.req.query('price_lte')) {
    query = query.where('price', '<=', Number(c.req.query('price_lte')));
  }
  
  // In stock
  if (c.req.query('stock_gt')) {
    query = query.where('stock', '>', Number(c.req.query('stock_gt')));
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
  
  // === SORTING ===
  const sort = c.req.query('sort') || 'created_at';
  const order = c.req.query('order') || 'desc';
  query = query.orderBy(sort as any, order as any);
  
  // === PAGINATION ===
  const page = Number(c.req.query('page')) || 1;
  const limit = Math.min(100, Number(c.req.query('limit')) || 20);
  const offset = (page - 1) * limit;
  
  // === EXECUTE ===
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

export default app;
```

### Frontend (React Native)

```typescript
// screens/ProductsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Picker } from 'react-native';
import { api } from '../api/client';
import { gte, lte, gt } from '@pubflow/flowfull-client';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadProducts();
  }, [page, category, minPrice, maxPrice, sortBy, sortOrder]);

  async function loadProducts() {
    setLoading(true);
    
    // Build query
    let query = api.query('/products');
    
    // Apply filters
    if (searchTerm) {
      query = query.search(searchTerm);
    }
    
    if (category) {
      query = query.where('category', category);
    }
    
    if (minPrice) {
      query = query.where('price', gte(Number(minPrice)));
    }
    
    if (maxPrice) {
      query = query.where('price', lte(Number(maxPrice)));
    }
    
    // Only in-stock products
    query = query.where('stock', gt(0));
    
    // Apply sorting and pagination
    const response = await query
      .sort(sortBy, sortOrder)
      .page(page)
      .limit(20)
      .get<Product[]>();
    
    if (response.success) {
      setProducts(response.data || []);
    }
    
    setLoading(false);
  }

  return (
    <View>
      {/* Search */}
      <TextInput
        placeholder="Search products..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={loadProducts}
      />
      
      {/* Category Filter */}
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Electronics" value="electronics" />
        <Picker.Item label="Clothing" value="clothing" />
        <Picker.Item label="Books" value="books" />
      </Picker>
      
      {/* Price Range */}
      <View>
        <TextInput
          placeholder="Min Price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Max Price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
        />
      </View>
      
      {/* Sort */}
      <Picker
        selectedValue={sortBy}
        onValueChange={setSortBy}
      >
        <Picker.Item label="Newest" value="created_at" />
        <Picker.Item label="Price" value="price" />
        <Picker.Item label="Name" value="name" />
      </Picker>
      
      {/* Products List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} />
        )}
        onEndReached={() => setPage(page + 1)}
      />
    </View>
  );
}
```

---

## 👥 Example 2: User Management Dashboard

### Backend (Hono + Kysely)

```typescript
// routes/users.ts
import { Hono } from 'hono';
import { db } from '../database';

const app = new Hono();

app.get('/users', async (c) => {
  let query = db.selectFrom('users');
  
  // === FILTERS ===
  
  // Status
  if (c.req.query('status')) {
    query = query.where('status', '=', c.req.query('status'));
  }
  
  // Role (multiple)
  if (c.req.query('role_in')) {
    const roles = c.req.query('role_in')!.split(',');
    query = query.where('role', 'in', roles);
  }
  
  // Exclude roles
  if (c.req.query('role_nin')) {
    const roles = c.req.query('role_nin')!.split(',');
    query = query.where('role', 'not in', roles);
  }
  
  // Verified users only
  if (c.req.query('verified_at_nnull') === 'true') {
    query = query.whereNotNull('verified_at');
  }
  
  // Unverified users only
  if (c.req.query('verified_at_null') === 'true') {
    query = query.whereNull('verified_at');
  }
  
  // Date range
  if (c.req.query('created_at_gte')) {
    query = query.where('created_at', '>=', c.req.query('created_at_gte'));
  }
  if (c.req.query('created_at_lte')) {
    query = query.where('created_at', '<=', c.req.query('created_at_lte'));
  }
  
  // Email domain
  if (c.req.query('email_ew')) {
    query = query.where('email', 'like', `%${c.req.query('email_ew')}`);
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
  
  // === SORTING ===
  const sort = c.req.query('sort') || 'created_at';
  const order = c.req.query('order') || 'desc';
  query = query.orderBy(sort as any, order as any);
  
  // === PAGINATION ===
  const page = Number(c.req.query('page')) || 1;
  const limit = Math.min(100, Number(c.req.query('limit')) || 50);
  
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

// Create user
app.post('/users', async (c) => {
  const body = await c.req.json();
  
  // Validate
  if (!body.email || !body.name) {
    return c.json({
      success: false,
      error: 'Email and name are required'
    }, 400);
  }
  
  // Check if email exists
  const existing = await db.selectFrom('users')
    .where('email', '=', body.email)
    .selectAll()
    .executeTakeFirst();
  
  if (existing) {
    return c.json({
      success: false,
      error: 'Email already exists'
    }, 400);
  }
  
  // Create user
  const user = await db.insertInto('users')
    .values({
      name: body.name,
      email: body.email.toLowerCase(),
      role: body.role || 'user',
      status: 'active',
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

// Update user
app.patch('/users/:id', async (c) => {
  const body = await c.req.json();
  
  const updates: any = { updated_at: new Date() };
  if (body.name) updates.name = body.name;
  if (body.email) updates.email = body.email.toLowerCase();
  if (body.role) updates.role = body.role;
  if (body.status) updates.status = body.status;
  
  const user = await db.updateTable('users')
    .set(updates)
    .where('id', '=', c.req.param('id'))
    .returningAll()
    .executeTakeFirst();
  
  if (!user) {
    return c.json({
      success: false,
      error: 'User not found'
    }, 404);
  }
  
  return c.json({
    success: true,
    data: user,
    message: 'User updated successfully'
  });
});

// Delete user
app.delete('/users/:id', async (c) => {
  const result = await db.deleteFrom('users')
    .where('id', '=', c.req.param('id'))
    .executeTakeFirst();
  
  if (result.numDeletedRows === 0n) {
    return c.json({
      success: false,
      error: 'User not found'
    }, 404);
  }
  
  return c.json({
    success: true,
    message: 'User deleted successfully'
  });
});

export default app;
```

### Frontend (React)

```typescript
// pages/UsersPage.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { inOp, notIn, isNotNull, endsWith } from '@pubflow/flowfull-client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  verified_at: string | null;
  created_at: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [emailDomain, setEmailDomain] = useState('');

  useEffect(() => {
    loadUsers();
  }, [page, statusFilter, roleFilter, verifiedOnly, emailDomain]);

  async function loadUsers() {
    setLoading(true);
    
    let query = api.query('/users');
    
    // Search
    if (searchTerm) {
      query = query.search(searchTerm);
    }
    
    // Status
    if (statusFilter) {
      query = query.where('status', statusFilter);
    }
    
    // Role filter (multiple)
    if (roleFilter.length > 0) {
      query = query.where('role', inOp(roleFilter));
    }
    
    // Exclude banned users
    query = query.where('role', notIn(['banned', 'suspended']));
    
    // Verified only
    if (verifiedOnly) {
      query = query.where('verified_at', isNotNull());
    }
    
    // Email domain
    if (emailDomain) {
      query = query.where('email', endsWith(`@${emailDomain}`));
    }
    
    const response = await query
      .sort('created_at', 'desc')
      .page(page)
      .limit(50)
      .get<User[]>();
    
    if (response.success) {
      setUsers(response.data || []);
      setTotal(response.meta?.total || 0);
    }
    
    setLoading(false);
  }

  async function createUser(data: { name: string; email: string; role: string }) {
    const response = await api.post('/users', data);
    
    if (response.success) {
      alert('User created successfully!');
      loadUsers(); // Reload list
    } else {
      alert(`Error: ${response.error}`);
    }
  }

  async function updateUser(id: string, updates: Partial<User>) {
    const response = await api.patch(`/users/${id}`, updates);
    
    if (response.success) {
      alert('User updated successfully!');
      loadUsers(); // Reload list
    } else {
      alert(`Error: ${response.error}`);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    const response = await api.delete(`/users/${id}`);
    
    if (response.success) {
      alert('User deleted successfully!');
      loadUsers(); // Reload list
    } else {
      alert(`Error: ${response.error}`);
    }
  }

  return (
    <div>
      <h1>User Management</h1>
      
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && loadUsers()}
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        
        <label>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
          />
          Verified Only
        </label>
        
        <input
          type="text"
          placeholder="Email domain (e.g., gmail.com)"
          value={emailDomain}
          onChange={(e) => setEmailDomain(e.target.value)}
        />
        
        <button onClick={loadUsers}>Apply Filters</button>
      </div>
      
      {/* Users Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>{user.verified_at ? '✓' : '✗'}</td>
              <td>
                <button onClick={() => updateUser(user.id, { status: 'inactive' })}>
                  Deactivate
                </button>
                <button onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {Math.ceil(total / 50)}</span>
        <button
          disabled={page >= Math.ceil(total / 50)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## 📊 Example 3: Analytics Dashboard

### Backend

```typescript
// routes/analytics.ts
app.get('/analytics/events', async (c) => {
  let query = db.selectFrom('events');
  
  // Event type
  if (c.req.query('event_type')) {
    query = query.where('event_type', '=', c.req.query('event_type'));
  }
  
  // Date range
  if (c.req.query('created_at_gte')) {
    query = query.where('created_at', '>=', c.req.query('created_at_gte'));
  }
  if (c.req.query('created_at_lte')) {
    query = query.where('created_at', '<=', c.req.query('created_at_lte'));
  }
  
  // Amount range
  if (c.req.query('amount_gte')) {
    query = query.where('amount', '>=', Number(c.req.query('amount_gte')));
  }
  
  // Group by (if requested)
  const groupBy = c.req.query('group_by');
  if (groupBy === 'date') {
    const stats = await query
      .select([
        db.fn('DATE', ['created_at']).as('date'),
        db.fn.count('id').as('count'),
        db.fn.sum('amount').as('total_amount'),
        db.fn.avg('amount').as('avg_amount')
      ])
      .groupBy(db.fn('DATE', ['created_at']))
      .orderBy('date', 'desc')
      .execute();
    
    return c.json({
      success: true,
      data: stats
    });
  }
  
  // Regular list
  const events = await query
    .selectAll()
    .orderBy('created_at', 'desc')
    .limit(100)
    .execute();
  
  return c.json({
    success: true,
    data: events
  });
});
```

### Frontend

```typescript
// pages/AnalyticsPage.tsx
import { api } from '../api/client';
import { between, gte } from '@pubflow/flowfull-client';

async function loadAnalytics() {
  const startDate = '2024-01-01';
  const endDate = '2024-12-31';
  
  const response = await api
    .query('/analytics/events')
    .where('event_type', 'purchase')
    .where('created_at', between(startDate, endDate))
    .where('amount', gte(50))
    .param('group_by', 'date')
    .param('aggregate', 'sum,count,avg')
    .get();
  
  if (response.success) {
    console.log('Analytics:', response.data);
  }
}
```

---

**Next:** [Backend API Structure](./backend-api-structure.md)

