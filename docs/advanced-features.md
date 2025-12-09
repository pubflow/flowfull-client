# 🚀 Advanced Features

> **Advanced capabilities** of Flowfull Client for power users

This guide covers advanced features like universal API compatibility, platform detection, sessionless requests, and more.

---

## 🌐 Universal API Compatibility

### Works with ANY API Response Format

Flowfull Client is **100% universal** and works with **any API response format**:

```typescript
// ✅ Standard format
{ "success": true, "data": [...] }

// ✅ Direct array
[{ id: 1 }, { id: 2 }]

// ✅ Direct object
{ id: 1, name: "John" }

// ✅ Custom format
{ "result": [...], "status": "ok" }

// ✅ Nested data
{ "response": { "items": [...] } }
```

### How It Works

The client wraps **any response** in a standard format:

```typescript
interface ApiResponse<T> {
  success: boolean;    // true if HTTP 2xx
  data: T;             // ← YOUR ENTIRE RESPONSE HERE
  status: number;      // HTTP status code
  message?: string;    // Optional message
  error?: string;      // Error message (if failed)
  meta?: any;          // Pagination metadata (if available)
}
```

### Examples

#### Example 1: Standard API

**Backend Response:**
```json
{
  "success": true,
  "data": [{ "id": 1, "name": "Product 1" }],
  "meta": { "page": 1, "total": 100 }
}
```

**Frontend:**
```typescript
const response = await api.get('/products');
console.log(response.data);  // { success: true, data: [...], meta: {...} }
```

#### Example 2: Direct Array API

**Backend Response:**
```json
[
  { "id": 1, "name": "Product 1" },
  { "id": 2, "name": "Product 2" }
]
```

**Frontend:**
```typescript
const response = await api.get('/products');
console.log(response.data);  // [{ id: 1, ... }, { id: 2, ... }]
```

#### Example 3: Custom Format API

**Backend Response:**
```json
{
  "result": { "items": [...] },
  "status": "ok",
  "code": 200
}
```

**Frontend:**
```typescript
const response = await api.get('/products');
console.log(response.data);  // { result: { items: [...] }, status: "ok", code: 200 }
```

### TypeScript Support

Use generics to type your responses:

```typescript
// Standard format
interface StandardResponse {
  success: boolean;
  data: Product[];
  meta: { page: number; total: number };
}

const response = await api.get<StandardResponse>('/products');
console.log(response.data.data);  // Product[]

// Direct array
const response = await api.get<Product[]>('/products');
console.log(response.data);  // Product[]

// Custom format
interface CustomResponse {
  result: { items: Product[] };
  status: string;
}

const response = await api.get<CustomResponse>('/products');
console.log(response.data.result.items);  // Product[]
```

---

## 🔍 Automatic Platform Detection

### How It Works

Flowfull Client **automatically detects** the platform and uses the appropriate storage:

```typescript
// Browser → localStorage
// React Native → AsyncStorage
// Node.js → No storage (manual session management)
```

### Detection Logic

1. **Check for Browser**
   ```typescript
   typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
   ```

2. **Check for React Native**
   ```typescript
   typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
   ```

3. **Auto-detect Session**
   - Browser: Search in `localStorage` for common keys
   - React Native: Search in `AsyncStorage` for common keys
   - Common keys: `pubflow_session_id`, `session_id`, `sessionId`, etc.

### Common Session Keys

The client automatically searches for these keys:

```typescript
const COMMON_SESSION_KEYS = [
  'pubflow_session_id',    // Pubflow standard
  'session_id',            // Generic
  'sessionId',             // Camel case
  'X-Session-ID',          // Header format
  'x-session-id'           // Lowercase header
];
```

### Example: Zero Configuration

```typescript
// Browser with localStorage
localStorage.setItem('pubflow_session_id', 'abc123');

const api = new FlowfullClient('https://api.example.com');
// ✅ Automatically finds session in localStorage

await api.get('/profile');  // Includes X-Session-ID: abc123
```

```typescript
// React Native with AsyncStorage
await AsyncStorage.setItem('pubflow_session_id', 'abc123');

const api = new FlowfullClient('https://api.example.com');
// ✅ Automatically finds session in AsyncStorage

await api.get('/profile');  // Includes X-Session-ID: abc123
```

---

## 🔓 Sessionless Requests

### When to Use

Use sessionless requests for:
- ✅ Public APIs (no authentication required)
- ✅ Login/Register endpoints
- ✅ Public data endpoints
- ✅ Third-party APIs
- ✅ Health checks

### Method 1: Global Configuration

**Disable sessions for all requests:**

```typescript
const api = new FlowfullClient('https://api.example.com', {
  includeSession: false  // ← Never include session
});

// All requests without session
await api.get('/public/products');
await api.post('/auth/login', { email, password });
await api.get('/health');
```

### Method 2: Per-Request Override

**Control session per request:**

```typescript
const api = new FlowfullClient('https://api.example.com');

// With session (default)
await api.get('/private/profile');

// Without session (override)
await api.get('/public/products', { includeSession: false });
await api.post('/auth/login', { email, password }, { includeSession: false });
```

### Method 3: No Session Configured

**If no session is configured, requests are automatically sessionless:**

```typescript
const api = new FlowfullClient('https://api.example.com');
// No session configured → all requests without session

await api.get('/data');  // No X-Session-ID header
```

### Example: Login Flow

```typescript
const api = new FlowfullClient('https://api.example.com', {
  includeSession: false  // Start without session
});

// Login (no session needed)
const loginResponse = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

if (loginResponse.success) {
  // Set session after login
  api.setSessionId(loginResponse.data.session_id);
  
  // Now all requests include session
  const profile = await api.get('/profile');
}
```

### Example: Mixed Requests

```typescript
const api = new FlowfullClient('https://api.example.com');

// Public endpoint (no session)
const products = await api.get('/public/products', { 
  includeSession: false 
});

// Private endpoint (with session)
const cart = await api.get('/cart');

// Logout (with session to invalidate)
await api.post('/auth/logout');

// Clear session
api.clearSession();
```

---

## 🎯 Session Management Strategies

### Strategy 1: Auto-Detect (Recommended)

**Best for**: Pubflow ecosystem apps

```typescript
// Zero configuration - auto-detects from storage
const api = new FlowfullClient('https://api.example.com');

// Automatically finds session from:
// - localStorage (browser)
// - AsyncStorage (React Native)
```

### Strategy 2: Manual Session

**Best for**: Custom authentication flows

```typescript
const api = new FlowfullClient('https://api.example.com', {
  sessionId: 'your-session-id'
});

// Or set later
api.setSessionId('your-session-id');
```

### Strategy 3: Function-Based

**Best for**: Dynamic session retrieval

```typescript
const api = new FlowfullClient('https://api.example.com', {
  getSessionId: async () => {
    // Get from secure storage
    return await SecureStore.getItemAsync('session_id');
  }
});
```

### Strategy 4: Storage Adapter

**Best for**: Custom storage solutions

```typescript
const api = new FlowfullClient('https://api.example.com', {
  storage: {
    getItem: async (key) => await customStorage.get(key),
    setItem: async (key, value) => await customStorage.set(key, value),
    removeItem: async (key) => await customStorage.delete(key)
  }
});
```

### Strategy 5: No Session

**Best for**: Public APIs

```typescript
const api = new FlowfullClient('https://api.example.com', {
  includeSession: false
});
```

---

## 🔧 Response Transformers

### Transform Responses Globally

Use response interceptors to transform all responses:

```typescript
const api = new FlowfullClient('https://api.example.com');

// Add response transformer
api.addResponseInterceptor(async (response) => {
  // Transform data
  if (response.success && response.data) {
    // Extract nested data
    if (response.data.result) {
      response.data = response.data.result;
    }
    
    // Convert dates
    if (response.data.created_at) {
      response.data.created_at = new Date(response.data.created_at);
    }
  }
  
  return response;
});
```

### Transform Specific Fields

```typescript
api.addResponseInterceptor(async (response) => {
  if (response.success && Array.isArray(response.data)) {
    // Transform array items
    response.data = response.data.map(item => ({
      ...item,
      // Convert timestamps to dates
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      // Format prices
      price: `$${(item.price / 100).toFixed(2)}`
    }));
  }
  
  return response;
});
```

---

## 🎨 Custom Headers

### Global Headers

```typescript
const api = new FlowfullClient('https://api.example.com', {
  headers: {
    'X-API-Key': 'your-api-key',
    'X-Client-Version': '1.0.0',
    'Accept-Language': 'es'
  }
});
```

### Dynamic Headers

```typescript
const api = new FlowfullClient('https://api.example.com');

// Set header
api.setHeader('X-API-Key', 'your-api-key');

// Remove header
api.removeHeader('X-API-Key');
```

### Per-Request Headers

```typescript
await api.get('/data', {
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

---

## 🔄 Request Interceptors

### Modify Requests Before Sending

```typescript
const api = new FlowfullClient('https://api.example.com');

api.addRequestInterceptor(async (config) => {
  // Add timestamp
  config.headers['X-Request-Time'] = Date.now().toString();
  
  // Add device info
  config.headers['X-Device-ID'] = await getDeviceId();
  
  // Log request
  console.log(`[${config.method}] ${config.url}`);
  
  return config;
});
```

### Add Authentication Token

```typescript
api.addRequestInterceptor(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
```

---

**Next:** [Backend API Structure](./backend-api-structure.md)

