# Response Handling Guide

Complete guide on how to access and use API response values in your frontend.

## 📦 Response Structure

All API calls return an `ApiResponse<T>` object with this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;      // Whether the request was successful
  data?: T;              // Response data (your actual data)
  error?: string;        // Error message (if success is false)
  message?: string;      // Additional message
  status: number;        // HTTP status code (200, 404, 500, etc.)
  meta?: PaginationMeta; // Pagination info (page, limit, total, etc.)
}
```

## ✅ Basic Usage - Accessing Data

### Simple GET Request

```typescript
import { createFlowfull } from '@pubflow/flowfull-client';

const api = createFlowfull('https://api.myapp.com');

// Get users
const response = await api.get('/users');

// ✅ Access the data
if (response.success) {
  const users = response.data;  // Array of users
  console.log(users);
} else {
  console.error(response.error);
}
```

### With TypeScript Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Type-safe response
const response = await api.get<User[]>('/users');

if (response.success && response.data) {
  // response.data is User[] | undefined
  const users: User[] = response.data;
  
  users.forEach(user => {
    console.log(user.name);   // ✅ Type-safe
    console.log(user.email);  // ✅ Type-safe
  });
}
```

## 🎨 Frontend Examples

### React - Display List

```tsx
import { createFlowfull } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';

const api = createFlowfull('https://api.myapp.com');

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>('/products');
      
      if (response.success && response.data) {
        setProducts(response.data);  // ✅ Set the data
      } else {
        setError(response.error || 'Failed to load products');
      }
      
      setLoading(false);
    }
    
    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image_url} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### React Native - Display List

```tsx
import { createFlowfull } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';

const api = createFlowfull('https://api.myapp.com');

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>('/products');
      
      if (response.success && response.data) {
        setProducts(response.data);  // ✅ Set the data
      }
      
      setLoading(false);
    }
    
    loadProducts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Image source={{ uri: item.image_url }} style={{ width: 100, height: 100 }} />
          <Text style={{ fontSize: 18 }}>{item.name}</Text>
          <Text style={{ fontSize: 16 }}>${item.price}</Text>
        </View>
      )}
    />
  );
}
```

## 💳 Payments API - Response Handling

### Create Payment Intent

```typescript
const response = await api.pay.createIntent({
  total_cents: 9999,
  currency: 'USD',
  provider_id: 'stripe_main'
});

if (response.success && response.data) {
  const intent = response.data;
  
  // ✅ Access payment intent values
  console.log(intent.id);              // Payment intent ID
  console.log(intent.client_secret);   // For Stripe.js
  console.log(intent.total_cents);     // 9999
  console.log(intent.status);          // 'pending'
}
```

### List Payment Methods

```typescript
const response = await api.pay.listMethods();

if (response.success && response.data) {
  const methods = response.data;

  // ✅ Display in UI
  methods.forEach(method => {
    console.log(method.id);
    console.log(method.type);          // 'card', 'apple_pay', etc.
    console.log(method.last4);         // Last 4 digits
    console.log(method.brand);         // 'visa', 'mastercard', etc.
    console.log(method.is_default);    // true/false
  });
}
```

### React Example - Payment Methods List

```tsx
import { useState, useEffect } from 'react';
import { createFlowfull, PaymentMethod } from '@pubflow/flowfull-client';

const api = createFlowfull('https://api.myapp.com');

function PaymentMethodsList() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    async function loadMethods() {
      const response = await api.pay.listMethods();

      if (response.success && response.data) {
        setMethods(response.data);  // ✅ Set payment methods
      }
    }

    loadMethods();
  }, []);

  return (
    <div className="payment-methods">
      {methods.map(method => (
        <div key={method.id} className="payment-card">
          <span className="brand">{method.brand?.toUpperCase()}</span>
          <span className="last4">•••• {method.last4}</span>
          {method.is_default && <span className="badge">Default</span>}
        </div>
      ))}
    </div>
  );
}
```

## 📄 Pagination Handling

### With Pagination Metadata

```typescript
const response = await api.get('/products', {
  params: { page: 1, limit: 20 }
});

if (response.success && response.data) {
  const products = response.data;

  // ✅ Access pagination info
  if (response.meta) {
    console.log(response.meta.page);       // Current page: 1
    console.log(response.meta.limit);      // Items per page: 20
    console.log(response.meta.total);      // Total items: 150
    console.log(response.meta.total_pages); // Total pages: 8
  }
}
```

### React Pagination Example

```tsx
function ProductListWithPagination() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>('/products', {
        params: { page, limit: 20 }
      });

      if (response.success && response.data) {
        setProducts(response.data);

        // ✅ Set pagination from meta
        if (response.meta?.total_pages) {
          setTotalPages(response.meta.total_pages);
        }
      }
    }

    loadProducts();
  }, [page]);

  return (
    <div>
      <div className="products">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## ⚠️ Error Handling

### Proper Error Handling

```typescript
async function createPayment() {
  try {
    const response = await api.pay.createIntent({
      total_cents: 5000,
      currency: 'USD',
      provider_id: 'stripe_main'
    });

    if (response.success && response.data) {
      // ✅ Success - use the data
      const intent = response.data;
      console.log('Payment intent created:', intent.id);
      return intent;
    } else {
      // ❌ API returned error
      console.error('API Error:', response.error);
      console.error('Status:', response.status);
      throw new Error(response.error || 'Payment failed');
    }
  } catch (error) {
    // ❌ Network or other error
    console.error('Request failed:', error);
    throw error;
  }
}
```

### React Error Handling

```tsx
function CheckoutForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const response = await api.pay.createIntent({
      total_cents: 9999,
      currency: 'USD',
      provider_id: 'stripe_main'
    });

    if (response.success && response.data) {
      // ✅ Success
      console.log('Payment created!');
    } else {
      // ❌ Show error to user
      setError(response.error || 'Payment failed');
    }

    setLoading(false);
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Always Check `success` and `data`

```typescript
// ✅ Good
const response = await api.get('/users');
if (response.success && response.data) {
  const users = response.data;
  // Use users safely
}

// ❌ Bad - might be undefined
const response = await api.get('/users');
const users = response.data;  // Could be undefined!
```

### 2. Use TypeScript Types

```typescript
// ✅ Good - Type-safe
interface User {
  id: string;
  name: string;
}

const response = await api.get<User[]>('/users');
if (response.success && response.data) {
  response.data.forEach(user => {
    console.log(user.name);  // ✅ Type-safe
  });
}
```

### 3. Handle Errors Properly

```typescript
// ✅ Good
const response = await api.pay.createIntent({ ... });

if (response.success && response.data) {
  // Success path
} else {
  // Error path
  console.error(response.error);
  console.error('Status:', response.status);
}
```

---

**See Also:**
- [Getting Started Guide](./getting-started.md)
- [Payments API Documentation](../PAYMENTS-API-UNIVERSAL.md)
- [Query Builder Guide](./query-builder.md)



