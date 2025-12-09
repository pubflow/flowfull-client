# ⚙️ Configuration Guide

Learn how to configure Flowfull Client for your specific needs.

---

## 🎯 Basic Configuration

### Using Factory Function

The simplest way to create a client:

```typescript
import { createFlowfull } from '@pubflow/flowfull-client';

const api = createFlowfull('https://api.myapp.com');
```

### Using FlowfullClient Class

For more control:

```typescript
import { FlowfullClient } from '@pubflow/flowfull-client';

const api = new FlowfullClient({
  baseURL: 'https://api.myapp.com'
});
```

---

## 🔑 Session Configuration

### Auto-Detection (Default)

Automatically detects session from Pubflow storage:

```typescript
const api = createFlowfull('https://api.myapp.com');
// Looks for 'pubflow_session_id' in localStorage/AsyncStorage
```

### Manual Session ID

Provide a static session ID:

```typescript
const api = createFlowfull('https://api.myapp.com', {
  sessionId: 'your-session-id-here'
});
```

### Dynamic Session (Function)

Use a function to get the session dynamically:

```typescript
const api = createFlowfull('https://api.myapp.com', {
  getSessionId: () => {
    return localStorage.getItem('my_custom_session_key');
  }
});

// Async function
const api = createFlowfull('https://api.myapp.com', {
  getSessionId: async () => {
    return await AsyncStorage.getItem('session_token');
  }
});
```

### Custom Storage Adapter

Use a custom storage adapter:

```typescript
const api = createFlowfull('https://api.myapp.com', {
  storage: {
    getItem: async (key) => {
      return await myCustomStorage.get(key);
    }
  },
  storageKeys: ['my_session_key', 'backup_session_key']
});
```

### Custom Session Header

Change the session header name (default: `X-Session-ID`):

```typescript
const api = createFlowfull('https://api.myapp.com', {
  sessionHeader: 'Authorization'
});
```

---

## 🌐 HTTP Configuration

### Default Headers

Set headers that will be included in all requests:

```typescript
const api = new FlowfullClient({
  baseURL: 'https://api.myapp.com',
  headers: {
    'X-API-Version': 'v2',
    'X-Client-ID': 'web-app',
    'Content-Type': 'application/json'
  }
});
```

### Timeout

Set request timeout (in milliseconds):

```typescript
const api = new FlowfullClient({
  baseURL: 'https://api.myapp.com',
  timeout: 30000  // 30 seconds
});
```

---

## 🔄 Retry Configuration

Configure automatic retry on failures:

```typescript
const api = new FlowfullClient({
  baseURL: 'https://api.myapp.com',
  retry: {
    attempts: 3,              // Number of retry attempts
    delay: 1000,              // Delay between retries (ms)
    exponentialBackoff: true  // Use exponential backoff
  }
});
```

### Retry Behavior

- **Network errors**: Always retried
- **5xx errors**: Retried (server errors)
- **4xx errors**: Not retried (client errors)
- **Timeout**: Retried

### Exponential Backoff

When enabled, retry delays increase exponentially:

- Attempt 1: 1000ms
- Attempt 2: 2000ms
- Attempt 3: 4000ms
- Attempt 4: 8000ms

---

## 🎨 Complete Configuration Example

```typescript
import { FlowfullClient } from '@pubflow/flowfull-client';

const api = new FlowfullClient({
  // Base URL
  baseURL: 'https://api.myapp.com',
  
  // Session management
  sessionId: undefined,  // Auto-detect
  sessionHeader: 'X-Session-ID',
  getSessionId: async () => {
    return await AsyncStorage.getItem('session_id');
  },
  
  // Storage
  storage: {
    getItem: async (key) => {
      return await AsyncStorage.getItem(key);
    }
  },
  storageKeys: ['pubflow_session_id', 'session_token'],
  
  // HTTP settings
  headers: {
    'X-API-Version': 'v2',
    'X-Client-ID': 'mobile-app',
    'Content-Type': 'application/json'
  },
  timeout: 30000,
  
  // Retry settings
  retry: {
    attempts: 3,
    delay: 1000,
    exponentialBackoff: true
  }
});
```

---

## 🔧 Runtime Configuration

### Update Headers

```typescript
// Add a header
api.setHeader('X-Custom-Header', 'value');

// Remove a header
api.removeHeader('X-Custom-Header');
```

### Update Session

```typescript
// Set session
api.setSessionId('new-session-id');

// Clear session
api.clearSession();

// Check if session exists
const hasSession = await api.hasSession();
```

---

## 🎯 Environment-Specific Configuration

### Development

```typescript
const api = createFlowfull(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://api.myapp.com',
  {
    retry: {
      attempts: process.env.NODE_ENV === 'development' ? 1 : 3
    }
  }
);
```

### React Native (Expo)

```typescript
import Constants from 'expo-constants';

const api = createFlowfull(
  Constants.expoConfig?.extra?.apiUrl || 'https://api.myapp.com'
);
```

### Next.js

```typescript
const api = createFlowfull(
  process.env.NEXT_PUBLIC_API_URL || 'https://api.myapp.com'
);
```

---

## 🔌 Interceptors

### Request Interceptor

Modify requests before they're sent:

```typescript
api.addRequestInterceptor(async (config) => {
  // Add timestamp to all requests
  config.headers['X-Request-Time'] = new Date().toISOString();
  
  // Log requests in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Request:', config.method, config.url);
  }
  
  return config;
});
```

### Response Interceptor

Process responses before they're returned:

```typescript
api.addResponseInterceptor(async (response) => {
  // Log errors
  if (!response.success) {
    console.error('API Error:', response.error);
  }
  
  // Track analytics
  if (response.success) {
    analytics.track('api_success', {
      endpoint: response.meta?.endpoint
    });
  }
  
  return response;
});
```

---

## 🎯 Multiple Instances

Create multiple clients for different APIs:

```typescript
// Main API
const mainApi = createFlowfull('https://api.myapp.com');

// Analytics API
const analyticsApi = createFlowfull('https://analytics.myapp.com', {
  headers: {
    'X-API-Key': process.env.ANALYTICS_API_KEY
  }
});

// Payment API
const paymentApi = createFlowfull('https://payments.myapp.com', {
  timeout: 60000,  // Longer timeout for payments
  retry: {
    attempts: 5
  }
});
```

---

## 💡 Best Practices

1. **Use environment variables** for API URLs
2. **Set appropriate timeouts** based on your API
3. **Enable retry** for production environments
4. **Use interceptors** for logging and analytics
5. **Create separate instances** for different APIs
6. **Store session securely** (use secure storage in mobile apps)

---

**Next:** [Error Handling Guide](./error-handling.md)

