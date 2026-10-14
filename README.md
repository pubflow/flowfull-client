# @pubflow/flowfull-client

> Universal HTTP client for Flowfull backends with advanced query building, filter operators, session management, multi-tenant support, and file uploads.

[![npm version](https://img.shields.io/npm/v/@pubflow/flowfull-client.svg)](https://www.npmjs.com/package/@pubflow/flowfull-client)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)

## 🚀 Features

- ✅ **Extremely Developer-Friendly** - Chainable query builder with intuitive API
- ✅ **14+ Filter Operators** - Comparison, string, array, null, and range operators
- ✅ **Multi-Tenant Support** - Connect to multiple Flowfull backends with isolated storage
- ✅ **File Upload** - Built-in file upload with progress tracking and custom headers
- ✅ **Payments API** - Clean interface for Bridge Payments with 33 methods
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
- **[Complete Route Coverage](./docs/complete-route-coverage.md)** - Bridge Payments and Ultra Forms route matrix
- **[Multi-Backend Modules](./docs/multi-backend-modules.md)** - Separate Flowless, Bridge Payments, and Ultra Forms hosts
- **[Response Handling Guide](./docs/response-handling.md)** ⭐ **NEW** - How to access and use API response values
- **[Universal Filter Syntax](../UNIVERSAL-FILTER-SYNTAX.md)** - Bracket syntax standard across all Flowfull clients
- **[Filter Operators](./docs/filter-operators.md)** - All 14+ operators explained with examples
- **[Query Builder](./docs/query-builder.md)** - Master the chainable API
- **[Configuration](./docs/configuration.md)** - Configure your client

### Payments API 💳
- **[Payments API Universal](../PAYMENTS-API-UNIVERSAL.md)** ⭐ **NEW** - Complete API reference for all 33 payment methods
- **[React Payments](./docs/react-payments.md)** ⭐ **NEW** - Payment integration for React apps
- **[React Native Payments](./docs/react-native-payments.md)** ⭐ **NEW** - Payment integration for React Native/Expo apps
- **[Next.js Payments](./docs/nextjs-payments.md)** ⭐ **NEW** - Payment integration for Next.js apps (App Router & Pages Router)

### Advanced Features
- **[Advanced Features](./docs/advanced-features.md)** - Universal API compatibility, platform detection, sessionless requests
- **[Future Features](./docs/future-features.md)** - Roadmap: cache, file upload, offline support, batch requests

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

**Bracket Syntax** (Universal Standard):
```typescript
// ✅ Using bracket syntax with .param() - auto-detected as filters
const products = await api
  .query('/products')
  .param('category[in]', 'electronics,computers')
  .param('price[gte]', 100)
  .param('price[lte]', 1000)
  .param('stock[gt]', 0)
  .get();

// Generated URL: /products?category[in]=electronics,computers&price[gte]=100&price[lte]=1000&stock[gt]=0
```

**Helper Functions** (Type-Safe):
```typescript
import { eq, gte, lte, gt, between, inOp, isNotNull } from '@pubflow/flowfull-client';

// ✅ Using helper functions with .where() - type-safe
const products = await api
  .query('/products')
  .where('category', inOp(['electronics', 'computers']))
  .where('price', gte(100))
  .where('price', lte(1000))
  .where('stock', gt(0))
  .get();

// Generated URL: /products?category[in]=electronics,computers&price[gte]=100&price[lte]=1000&stock[gt]=0
```

**Mix Both** (Flexible):
```typescript
// ✅ Combine bracket syntax and helper functions
const products = await api
  .query('/products')
  .param('category[in]', 'electronics,computers')  // Bracket syntax
  .where('price', gte(100))                        // Helper function
  .param('include', 'images')                      // Plain param
  .get();
```

> **Note:** Both syntaxes generate the same bracket syntax `field[operator]=value` in the URL, which is compatible with @pubflow/bridge backend.

### Multi-Tenant Support

Connect to multiple Flowfull backends with isolated storage:

```typescript
// Tenant 1 with isolated storage
const tenant1 = createFlowfull('https://tenant1.api.com', {
  name: 'tenant1',
  storageConfig: {
    adapter: localStorage,
    prefix: 'tenant1'  // Storage keys: tenant1_pubflow_session_id, tenant1_pubflow_user_data
  }
});

// Tenant 2 with isolated storage
const tenant2 = createFlowfull('https://tenant2.api.com', {
  name: 'tenant2',
  storageConfig: {
    adapter: localStorage,
    prefix: 'tenant2'  // Storage keys: tenant2_pubflow_session_id, tenant2_pubflow_user_data
  }
});

// Each instance maintains separate sessions
await tenant1.post('/auth/login', { email: 'user@tenant1.com', password: 'pass' });
await tenant2.post('/auth/login', { email: 'user@tenant2.com', password: 'pass' });

// Use independently
const data1 = await tenant1.get('/data');
const data2 = await tenant2.get('/data');
```

### File Upload

Built-in file upload with progress tracking:

```typescript
// Simple upload
const response = await api.uploadFile('/auth/upload/picture', imageFile, {
  field: 'picture'
});

// With progress tracking
const response = await api.uploadFile('/upload', file, {
  field: 'document',
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress}%`);
  },
  data: {
    title: 'My Document',
    category: 'reports'
  }
});

// S3 direct upload with custom headers
const response = await api.uploadFile(presignedUrl, file, {
  headers: {
    'x-amz-acl': 'public-read',
    'x-amz-meta-user-id': 'user123'
  }
});

// Backblaze B2 upload
const response = await api.uploadFile(b2UploadUrl, file, {
  headers: {
    'X-Bz-File-Name': 'document.pdf',
    'X-Bz-Content-Type': 'application/pdf'
  }
});
```

### Payments API

```typescript
// Create payment intent
const intent = await api.pay.createIntent({
  total_cents: 9999,  // $99.99
  currency: 'USD',
  provider_id: 'stripe_main',
  description: 'Order #12345'
});

// List payment methods
const methods = await api.pay.listMethods();

// Create subscription
const subscription = await api.pay.createSubscription({
  customer_id: 'cus_abc123',
  payment_method_id: 'pm_abc123',
  product_id: 'prod_premium',
  trial_days: 14
});

// Manage organizations
const org = await api.pay.createOrganization({
  name: 'Acme Corp',
  business_email: 'billing@acme.com'
});

// Add team members
await api.pay.addOrgMember(org.data.id, {
  email: 'admin@acme.com',
  role: 'admin'
});
```

See [PAYMENTS-API-UNIVERSAL.md](../PAYMENTS-API-UNIVERSAL.md) for complete documentation of all 33 payment methods.

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

**@pubflow/flowfull-client** is licensed under the **AGPL-3.0-only** open source license.

### What does this mean?

- ✅ **Free to use** - Use commercially without paying anything
- ✅ **Modify freely** - Change the code as needed
- ✅ **Distribute** - Share with others
- ⚠️ **Share modifications** - If you modify and offer as a web service, you must release your changes
- ⚠️ **Same license** - Derivative works must use AGPL-3.0

### Commercial License Available

For organizations that cannot comply with AGPL-3.0 or need:
- 💼 Keep modifications private
- 🛡️ Legal indemnification
- 🎯 Enterprise support and SLA
- 🚀 Custom features

**Contact:** enterprise@pubflow.com
**Learn more:** https://pubflow.com/dual-licensing

See [LICENSE](./LICENSE) for full details.

## 🔗 Related Packages

- [@pubflow/core](https://www.npmjs.com/package/@pubflow/core) - Core Pubflow library
- [@pubflow/react](https://www.npmjs.com/package/@pubflow/react) - React integration
- [@pubflow/react-native](https://www.npmjs.com/package/@pubflow/react-native) - React Native integration
- [@pubflow/nextjs](https://www.npmjs.com/package/@pubflow/nextjs) - Next.js integration
- [Commercial License](https://pubflow.com/dual-licensing) - Dual licensing options

---

**Copyright © 2024-present Pubflow, Inc.**
**SPDX-License-Identifier:** AGPL-3.0-only
