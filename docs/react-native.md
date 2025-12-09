# 📱 React Native Guide

Learn how to use Flowfull Client in your React Native and Expo apps.

---

## 📦 Installation

```bash
# npm
npm install @pubflow/flowfull-client

# yarn
yarn add @pubflow/flowfull-client

# expo
npx expo install @pubflow/flowfull-client
```

---

## 🚀 Quick Start

### Basic Setup

```typescript
// api/client.ts
import { createFlowfull } from '@pubflow/flowfull-client';
import Constants from 'expo-constants';

export const api = createFlowfull(
  Constants.expoConfig?.extra?.apiUrl || 'https://api.myapp.com'
);
```

### Environment Configuration

```javascript
// app.config.js
export default {
  expo: {
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.myapp.com'
    }
  }
};
```

---

## 🔑 Session Management

### Auto-Detection with AsyncStorage

Flowfull Client automatically detects sessions from AsyncStorage:

```typescript
import { createFlowfull } from '@pubflow/flowfull-client';

// Automatically looks for 'pubflow_session_id' in AsyncStorage
const api = createFlowfull('https://api.myapp.com');
```

### Manual Session Management

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = createFlowfull('https://api.myapp.com', {
  getSessionId: async () => {
    return await AsyncStorage.getItem('session_id');
  }
});
```

### Login Flow

```typescript
// screens/LoginScreen.tsx
import { api } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function handleLogin(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  
  if (response.success && response.data.session_id) {
    // Save session
    await AsyncStorage.setItem('pubflow_session_id', response.data.session_id);
    
    // Update client
    api.setSessionId(response.data.session_id);
    
    // Navigate to home
    navigation.navigate('Home');
  } else {
    Alert.alert('Error', response.error || 'Login failed');
  }
}
```

### Logout Flow

```typescript
async function handleLogout() {
  // Call logout endpoint
  await api.post('/auth/logout');
  
  // Clear session from AsyncStorage
  await AsyncStorage.removeItem('pubflow_session_id');
  await AsyncStorage.removeItem('pubflow_user_data');
  
  // Clear session from client
  api.clearSession();
  
  // Navigate to login
  navigation.navigate('Login');
}
```

---

## 🎨 Using in Components

### Functional Component with Hooks

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { api } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
}

export function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    
    const response = await api
      .query('/users')
      .where('status', 'active')
      .sort('name', 'asc')
      .limit(50)
      .get<User[]>();
    
    if (response.success) {
      setUsers(response.data || []);
    } else {
      setError(response.error || 'Failed to load users');
    }
    
    setLoading(false);
  }

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
}
```

### Pagination Example

```typescript
import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { api } from '../api/client';

export function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadProducts() {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    const response = await api
      .query('/products')
      .where('status', 'active')
      .page(page)
      .limit(20)
      .get();
    
    if (response.success) {
      setProducts([...products, ...response.data]);
      setHasMore(response.meta?.hasMore || false);
      setPage(page + 1);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <FlatList
      data={products}
      onEndReached={loadProducts}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator /> : null}
    />
  );
}
```

---

## 🔍 Search Implementation

```typescript
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { api } from '../api/client';

export function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 3) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  async function performSearch() {
    setLoading(true);
    
    const response = await api
      .query('/products')
      .search(searchTerm)
      .where('status', 'active')
      .limit(20)
      .get();
    
    if (response.success) {
      setResults(response.data || []);
    }
    
    setLoading(false);
  }

  return (
    <View>
      <TextInput
        placeholder="Search products..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductItem product={item} />}
      />
    </View>
  );
}
```

---

## 📤 Form Submission

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { api } from '../api/client';

export function CreateUserScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    
    const response = await api.post('/users', {
      name,
      email
    });
    
    setLoading(false);
    
    if (response.success) {
      Alert.alert('Success', 'User created successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', response.error || 'Failed to create user');
    }
  }

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title="Create User"
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}
```

---

## 🎯 Custom Hook Pattern

Create a reusable hook for API calls:

```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { ApiResponse } from '@pubflow/flowfull-client';

export function useApi<T>(
  endpoint: string,
  options?: {
    autoLoad?: boolean;
    filters?: Record<string, any>;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    
    let query = api.query(endpoint);
    
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.where(key, value);
      });
    }
    
    const response = await query.get<T>();
    
    if (response.success) {
      setData(response.data || null);
    } else {
      setError(response.error || 'Request failed');
    }
    
    setLoading(false);
    return response;
  }

  useEffect(() => {
    if (options?.autoLoad !== false) {
      load();
    }
  }, []);

  return { data, loading, error, reload: load };
}

// Usage
export function UsersScreen() {
  const { data: users, loading, error, reload } = useApi<User[]>('/users', {
    filters: { status: 'active' }
  });

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  
  return <UserList users={users || []} onRefresh={reload} />;
}
```

---

## 💡 Best Practices

1. **Create a single API instance** and export it
2. **Use AsyncStorage** for session persistence
3. **Handle loading states** in your UI
4. **Show error messages** to users
5. **Implement pull-to-refresh** for better UX
6. **Use custom hooks** for reusable API logic
7. **Debounce search inputs** to reduce API calls
8. **Clear session on logout** from both AsyncStorage and client

---

## 🔧 Debugging

Enable logging in development:

```typescript
import { createFlowfull } from '@pubflow/flowfull-client';

const api = createFlowfull('https://api.myapp.com');

if (__DEV__) {
  api.addRequestInterceptor(async (config) => {
    console.log('📤 Request:', config.method, config.url);
    return config;
  });

  api.addResponseInterceptor(async (response) => {
    console.log('📥 Response:', response.status, response.success);
    return response;
  });
}
```

---

**Next:** [TypeScript Guide](./typescript.md)

