# 🚀 Getting Started with Flowfull Client

Welcome! This guide will help you get up and running with `@pubflow/flowfull-client` in just a few minutes.

---

## 📦 Installation

Install the package using your favorite package manager:

```bash
# npm
npm install @pubflow/flowfull-client

# yarn
yarn add @pubflow/flowfull-client

# pnpm
pnpm add @pubflow/flowfull-client

# bun
bun add @pubflow/flowfull-client
```

---

## 🎯 Quick Start

### 1. Create Your First Client

The simplest way to get started is with the `createFlowfull` factory function:

```typescript
import { createFlowfull } from '@pubflow/flowfull-client';

// Create a client pointing to your Flowfull backend
const api = createFlowfull('https://api.myapp.com');
```

That's it! You now have a fully functional HTTP client ready to use.

---

### 2. Make Your First Request

#### Simple GET Request

```typescript
// Fetch all users
const response = await api.get('/users');

if (response.success) {
  console.log('Users:', response.data);
} else {
  console.error('Error:', response.error);
}
```

#### POST Request (Create Data)

```typescript
const newUser = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
};

const response = await api.post('/users', newUser);

if (response.success) {
  console.log('Created user:', response.data);
}
```

#### PUT Request (Update Data)

```typescript
const updates = {
  name: 'John Updated'
};

const response = await api.put('/users/123', updates);
```

#### PATCH Request (Partial Update)

```typescript
const response = await api.patch('/users/123', {
  status: 'active'
});
```

#### DELETE Request

```typescript
const response = await api.delete('/users/123');
```

---

### 3. Using the Query Builder

The query builder makes it super easy to build complex queries with filters, pagination, and sorting:

```typescript
const response = await api
  .query('/products')
  .where('status', 'active')
  .where('price', 'gte', 50)
  .sort('price', 'asc')
  .page(1)
  .limit(20)
  .get();

console.log('Products:', response.data);
console.log('Pagination:', response.meta);
```

---

## 🔑 Session Management

### Auto-Detection (Recommended)

If you're using Pubflow authentication, the client will automatically detect your session:

```typescript
// Session is auto-detected from localStorage (pubflow_session_id)
const api = createFlowfull('https://api.myapp.com');

// All requests will include the session header automatically
const response = await api.get('/profile');
```

### Manual Session

You can also provide a session ID manually:

```typescript
const api = createFlowfull('https://api.myapp.com', {
  sessionId: 'your-session-id-here'
});
```

### Dynamic Session

For more complex scenarios, use a function:

```typescript
const api = createFlowfull('https://api.myapp.com', {
  getSessionId: () => {
    // Get session from your auth system
    return localStorage.getItem('my_session_key');
  }
});
```

---

## 🎨 Response Format

All responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;      // Whether the request succeeded
  data?: T;              // Response data (if successful)
  error?: string;        // Error message (if failed)
  message?: string;      // Additional message
  status: number;        // HTTP status code
  meta?: {               // Pagination metadata (if applicable)
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
```

### Example Usage

```typescript
const response = await api.get('/users');

// Always check success first
if (response.success) {
  // TypeScript knows data is available
  console.log('Users:', response.data);
  
  // Check pagination
  if (response.meta) {
    console.log(`Page ${response.meta.page} of ${response.meta.totalPages}`);
  }
} else {
  // Handle error
  console.error(`Error ${response.status}: ${response.error}`);
}
```

---

## 🎯 Next Steps

Now that you know the basics, explore more advanced features:

- **[Filter Operators](./filter-operators.md)** - Learn about all 14 filter operators
- **[Query Builder](./query-builder.md)** - Master the chainable query builder
- **[Configuration](./configuration.md)** - Customize your client
- **[Error Handling](./error-handling.md)** - Handle errors like a pro
- **[TypeScript](./typescript.md)** - Get the most out of TypeScript

---

## 💡 Common Patterns

### Fetching with Filters

```typescript
const activeUsers = await api
  .query('/users')
  .where('status', 'active')
  .where('verified', true)
  .get();
```

### Pagination

```typescript
const page2 = await api
  .query('/products')
  .page(2)
  .limit(25)
  .get();
```

### Search

```typescript
const results = await api
  .query('/products')
  .search('laptop')
  .get();
```

---

## ❓ Need Help?

- 📚 Check out the [full documentation](./README.md)
- 💬 Join our [Discord community](https://discord.gg/pubflow)
- 🐛 Report issues on [GitHub](https://github.com/pubflow/flowfull-client)

---

**Happy coding!** 🎉

