# 📚 Flowfull Client Documentation

Welcome to the complete documentation for **@pubflow/flowfull-client** - the universal HTTP client for Flowfull backends.

---

## 🎯 What is Flowfull Client?

Flowfull Client is a **developer-friendly, type-safe HTTP client** designed specifically for connecting to Flowfull backends. It provides:

- ✅ **Chainable Query Builder** - Build complex queries with ease
- ✅ **14 Filter Operators** - Powerful filtering capabilities
- ✅ **Auto Session Management** - Works seamlessly with Pubflow auth
- ✅ **TypeScript First** - Complete type safety
- ✅ **Universal** - Works with React, React Native, Next.js, and vanilla JS
- ✅ **Retry Logic** - Automatic retry on failures
- ✅ **Interceptors** - Customize requests and responses
- ✅ **Multiple Instances** - Connect to multiple APIs

---

## 📖 Documentation Index

### Getting Started
- **[Getting Started](./getting-started.md)** - Quick start guide and basic usage
- **[Installation](./getting-started.md#installation)** - How to install the package
- **[Response Handling](./response-handling.md)** ⭐ **NEW** - How to access and use API response values

### Core Concepts
- **[Filter Operators](./filter-operators.md)** - Complete guide to all 14 filter operators
- **[Query Builder](./query-builder.md)** - Master the chainable query builder API
- **[Configuration](./configuration.md)** - Configure your client for your needs
- **[Multi-Backend Modules](./multi-backend-modules.md)** - Bridge Payments, Ultra Forms, Blog, and Onboarding helpers
- **[Error Handling](./error-handling.md)** - Handle errors like a pro

### Payments API 💳
- **[Payments API Universal](../PAYMENTS-API-UNIVERSAL.md)** ⭐ **NEW** - Complete reference for all 33 payment methods
- **[React Payments](./react-payments.md)** ⭐ **NEW** - Payment integration for React apps
- **[React Native Payments](./react-native-payments.md)** ⭐ **NEW** - Payment integration for React Native/Expo apps
- **[Next.js Payments](./nextjs-payments.md)** ⭐ **NEW** - Payment integration for Next.js apps
- **[Payments Examples](../examples/payments-example.ts)** ⭐ **NEW** - 6 complete usage scenarios

### Platform-Specific Guides
- **[React Native](./react-native.md)** - Using Flowfull Client in React Native/Expo apps
- **[React](./react.md)** - Using Flowfull Client in React apps (coming soon)
- **[Next.js](./nextjs.md)** - Using Flowfull Client in Next.js apps (coming soon)

### Backend Development
- **[Backend API Structure](./backend-api-structure.md)** ⭐ **For Backend Devs** - How to structure your API for Flowfull Client compatibility
- **[Full-Stack Examples](./full-stack-examples.md)** - Complete frontend + backend integration examples

### Advanced Topics
- **[Advanced Features](./advanced-features.md)** - Universal API compatibility, platform detection, sessionless requests
- **[Future Features](./future-features.md)** - Roadmap and upcoming features (cache, file upload, offline support)
- **[TypeScript](./typescript.md)** - Get the most out of TypeScript (coming soon)
- **[Session Management](./session-management.md)** - Advanced session management patterns (coming soon)
- **[Interceptors](./interceptors.md)** - Customize requests and responses (coming soon)
- **[Multiple Instances](./multiple-instances.md)** - Working with multiple APIs (coming soon)

### Reference
- **[API Reference](./api-reference.md)** - Complete API documentation
- **[Migration Guide](./migration.md)** - Migrating from other HTTP clients

---

## 🚀 Quick Example

```typescript
import { createFlowfull } from '@pubflow/flowfull-client';

// Create client
const api = createFlowfull('https://api.myapp.com');

// Simple request
const users = await api.get('/users');

// Complex query
const products = await api
  .query('/products')
  .search('laptop')
  .where('status', 'active')
  .where('price', 'gte', 500)
  .where('price', 'lte', 2000)
  .sort('price', 'asc')
  .page(1)
  .limit(20)
  .get();

if (products.success) {
  console.log('Products:', products.data);
  console.log('Total:', products.meta?.total);
}
```

---

## 🎯 Key Features

### Chainable Query Builder

Build complex queries with a fluent, chainable API:

```typescript
const response = await api
  .query('/users')
  .where('status', 'active')
  .where('age', 'gte', 18)
  .search('john')
  .sort('name', 'asc')
  .page(1)
  .limit(20)
  .get();
```

### 14 Powerful Filter Operators

- **Comparison**: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`
- **String**: `like`, `ilike`, `startsWith`, `endsWith`
- **Array**: `in`, `notIn`
- **Null**: `isNull`, `isNotNull`
- **Range**: `between`, `notBetween`

```typescript
import { gte, inOp, isNotNull } from '@pubflow/flowfull-client';

const users = await api
  .query('/users')
  .where('age', gte(21))
  .where('role', inOp(['admin', 'moderator']))
  .where('verified_at', isNotNull())
  .get();
```

### Auto Session Management

Works seamlessly with Pubflow authentication:

```typescript
// Automatically detects session from localStorage/AsyncStorage
const api = createFlowfull('https://api.myapp.com');

// All requests include session header automatically
const profile = await api.get('/profile');
```

### TypeScript Support

Full type safety with generics:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const response = await api.get<User[]>('/users');

if (response.success) {
  // TypeScript knows response.data is User[]
  response.data.forEach(user => {
    console.log(user.name);
  });
}
```

### Retry Logic

Automatic retry on network errors and 5xx responses:

```typescript
const api = createFlowfull('https://api.myapp.com', {
  retry: {
    attempts: 3,
    delay: 1000,
    exponentialBackoff: true
  }
});
```

### Interceptors

Customize requests and responses:

```typescript
// Add timestamp to all requests
api.addRequestInterceptor(async (config) => {
  config.headers['X-Request-Time'] = new Date().toISOString();
  return config;
});

// Log all errors
api.addResponseInterceptor(async (response) => {
  if (!response.success) {
    console.error('API Error:', response.error);
  }
  return response;
});
```

---

## 🌍 Universal Compatibility

Works everywhere JavaScript runs:

- ✅ **React** - Web applications
- ✅ **React Native** - Mobile apps (iOS/Android)
- ✅ **Expo** - Managed React Native apps
- ✅ **Next.js** - Server and client components
- ✅ **Node.js** - Backend applications
- ✅ **Bun** - Modern JavaScript runtime
- ✅ **Vanilla JS** - No framework needed

---

## 📦 What's Included

```
@pubflow/flowfull-client
├── Core Client (FlowfullClient)
├── Query Builder (QueryBuilder)
├── Session Manager (SessionManager)
├── Request Handler (RequestHandler)
├── 14 Filter Operators
├── TypeScript Types
└── Utility Functions
```

---

## 🎓 Learning Path

1. **Start Here**: [Getting Started Guide](./getting-started.md)
2. **Learn Filtering**: [Filter Operators](./filter-operators.md)
3. **Master Queries**: [Query Builder](./query-builder.md)
4. **Platform Guide**: [React Native](./react-native.md) | [React](./react.md) | [Next.js](./nextjs.md)
5. **Advanced**: [TypeScript](./typescript.md) | [Interceptors](./interceptors.md)

---

## 💡 Common Use Cases

### E-commerce Product Search

```typescript
const products = await api
  .query('/products')
  .search(searchTerm)
  .where('category', category)
  .where('price', 'gte', minPrice)
  .where('price', 'lte', maxPrice)
  .where('in_stock', true)
  .sort('price', 'asc')
  .page(page)
  .limit(20)
  .get();
```

### User Management

```typescript
const activeUsers = await api
  .query('/users')
  .where('status', 'active')
  .where('verified_at', isNotNull())
  .where('role', notIn(['banned', 'suspended']))
  .sort('created_at', 'desc')
  .get();
```

### Analytics Dashboard

```typescript
const stats = await api
  .query('/analytics/events')
  .where('event_type', 'purchase')
  .where('created_at', between(startDate, endDate))
  .param('group_by', 'date')
  .param('aggregate', 'sum,count,avg')
  .get();
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

## 🆘 Support

- 📚 [Documentation](./getting-started.md)
- 💬 [Discord Community](https://discord.gg/pubflow)
- 🐛 [GitHub Issues](https://github.com/pubflow/flowfull-client-ts/issues)
- 📧 [Email Support](mailto:support@pubflow.com)

---

**Ready to get started?** → [Getting Started Guide](./getting-started.md)
