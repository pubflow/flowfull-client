# @pubflow/flowfull-client

> Universal HTTP client for Flowfull backends with advanced query building, filter operators, and session management.

[![npm version](https://img.shields.io/npm/v/@pubflow/flowfull-client.svg)](https://www.npmjs.com/package/@pubflow/flowfull-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- ✅ **Extremely Developer-Friendly** - Chainable query builder with intuitive API
- ✅ **14+ Filter Operators** - Comparison, string, array, null, and range operators
- ✅ **Multiple Instances** - Connect to multiple Flowfull backends simultaneously
- ✅ **Session Management** - Auto-detect or manual session handling
- ✅ **TypeScript-First** - Full type safety with generics
- ✅ **Universal** - Works with React, React Native, Next.js, and vanilla JS
- ✅ **Integrated** - Shares session with @pubflow packages automatically
- ✅ **Production-Ready** - Retry logic, timeouts, interceptors

## 📦 Installation

```bash
npm install @pubflow/flowfull-client
```

```bash
yarn add @pubflow/flowfull-client
```

```bash
pnpm add @pubflow/flowfull-client
```

```bash
bun add @pubflow/flowfull-client
```

## 🎯 Quick Start

```typescript
import { createFlowfull } from '@pubflow/flowfull-client';

// Create client
const api = createFlowfull('https://api.myapp.com');

// Simple GET request
const users = await api.get('/users');

// Query builder
const products = await api
  .query('/products')
  .where('status', 'active')
  .where('price', 'gte', 50)
  .sort('price', 'asc')
  .page(1)
  .limit(20)
  .get();
```

## 📚 Documentation

### Getting Started
- **[Getting Started Guide](./docs/getting-started.md)** - Complete beginner's guide
- **[Filter Operators](./docs/filter-operators.md)** - All 14 operators explained with examples
- **[Query Builder](./docs/query-builder.md)** - Master the chainable API
- **[Configuration](./docs/configuration.md)** - Configure your client

### Advanced Features
- **[Advanced Features](./docs/advanced-features.md)** ⭐ **NEW** - Universal API compatibility, platform detection, sessionless requests
- **[Future Features](./docs/future-features.md)** ⭐ **NEW** - Roadmap: cache, file upload, offline support, batch requests

### Platform Guides
- **[React Native](./docs/react-native.md)** - Mobile app integration (Expo/RN)
- **[Query Examples](./QUERY-EXAMPLES.md)** - Comprehensive examples

### Backend Development
- **[Backend API Structure](./docs/backend-api-structure.md)** ⭐ **For Backend Devs** - How to build APIs compatible with Flowfull Client
- **[Full-Stack Examples](./docs/full-stack-examples.md)** - Complete frontend + backend integration examples

### Reference
- **[Full Documentation](./docs/README.md)** - Complete documentation index
- **[Test Status](./TEST-STATUS.md)** - Current test coverage and status

## 🔥 Key Features

### Chainable Query Builder

```typescript
const users = await api
  .query('/users')
  .where('status', 'active')
  .where('age', 'gte', 18)
  .search('john')
  .sort('created_at', 'desc')
  .page(1)
  .limit(20)
  .get();
```

### Filter Operators

```typescript
import { eq, gte, between, inOp, isNotNull } from '@pubflow/flowfull-client';

// Comparison
.where('age', gte(18))
.where('price', between(10, 100))

// String
.where('name', like('john'))
.where('email', endsWith('@gmail.com'))

// Array
.where('status', inOp(['active', 'pending']))

// Null
.where('email_verified_at', isNotNull())
```

### Multiple Instances

```typescript
// Main API
const mainApi = createFlowfull('https://api.myapp.com');

// Analytics API
const analyticsApi = createFlowfull('https://analytics.myapp.com');

// Payments API
const paymentsApi = createFlowfull('https://payments.myapp.com');
```

### Session Management

```typescript
// Auto-detect from Pubflow
const api = createFlowfull('https://api.myapp.com');

// Manual session
const api = createFlowfull('https://api.myapp.com', {
  sessionId: 'my-session-id'
});

// Function to get session
const api = createFlowfull('https://api.myapp.com', {
  getSessionId: () => localStorage.getItem('custom_session')
});
```

### TypeScript Support

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const { data: users } = await api.get<User[]>('/users');
// users is User[] | undefined
```

## 🌐 Platform Support

- ✅ **React** - Full support with hooks
- ✅ **React Native** - AsyncStorage integration
- ✅ **Next.js** - Client and server components
- ✅ **Vanilla JS** - Works anywhere

## 📖 Examples

See [QUERY-EXAMPLES.md](./QUERY-EXAMPLES.md) for comprehensive examples including:

- Basic queries (GET, POST, PUT, PATCH, DELETE)
- All 14 filter operators
- Pagination and sorting
- Search functionality
- Complex queries
- Multiple instances
- TypeScript examples
- Real-world use cases

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT © [Pubflow Team](https://github.com/pubflow)

## 🔗 Related Packages

- [@pubflow/core](https://www.npmjs.com/package/@pubflow/core) - Core Pubflow library
- [@pubflow/react](https://www.npmjs.com/package/@pubflow/react) - React integration
- [@pubflow/react-native](https://www.npmjs.com/package/@pubflow/react-native) - React Native integration
- [@pubflow/nextjs](https://www.npmjs.com/package/@pubflow/nextjs) - Next.js integration

