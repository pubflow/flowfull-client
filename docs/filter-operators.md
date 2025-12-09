# 🔍 Filter Operators Guide

Flowfull Client provides **14 powerful filter operators** to help you query your data with precision. This guide covers all of them with real-world examples.

---

## 📋 Quick Reference

| Operator | Alias | Description | Example |
|----------|-------|-------------|---------|
| `eq` | `equals` | Equals | `where('status', eq('active'))` |
| `ne` | `notEquals` | Not equals | `where('status', ne('deleted'))` |
| `gt` | `greaterThan` | Greater than | `where('age', gt(18))` |
| `gte` | `greaterThanOrEquals` | Greater than or equals | `where('age', gte(21))` |
| `lt` | `lessThan` | Less than | `where('price', lt(100))` |
| `lte` | `lessThanOrEquals` | Less than or equals | `where('price', lte(50))` |
| `like` | - | Pattern match (case-sensitive) | `where('name', like('John'))` |
| `ilike` | - | Pattern match (case-insensitive) | `where('email', ilike('GMAIL'))` |
| `startsWith` | `sw` | Starts with | `where('name', startsWith('Mr.'))` |
| `endsWith` | `ew` | Ends with | `where('email', endsWith('@gmail.com'))` |
| `in` | `inOp` | In array | `where('status', inOp(['active', 'pending']))` |
| `notIn` | `nin` | Not in array | `where('role', notIn(['banned', 'deleted']))` |
| `isNull` | - | Is null | `where('deleted_at', isNull())` |
| `isNotNull` | - | Is not null | `where('verified_at', isNotNull())` |
| `between` | - | Between two values | `where('price', between(10, 100))` |
| `notBetween` | - | Not between two values | `where('age', notBetween(0, 18))` |

---

## 🎯 Comparison Operators

### Equals (`eq`)

Find exact matches:

```typescript
import { eq } from '@pubflow/flowfull-client';

// Find active users
const users = await api
  .query('/users')
  .where('status', eq('active'))
  .get();

// Shorthand (defaults to eq)
const users = await api
  .query('/users')
  .where('status', 'active')
  .get();
```

### Not Equals (`ne`)

Exclude specific values:

```typescript
import { ne } from '@pubflow/flowfull-client';

// Find all users except deleted ones
const users = await api
  .query('/users')
  .where('status', ne('deleted'))
  .get();
```

### Greater Than (`gt`)

Find values greater than a threshold:

```typescript
import { gt } from '@pubflow/flowfull-client';

// Find users older than 18
const adults = await api
  .query('/users')
  .where('age', gt(18))
  .get();

// Find expensive products
const premium = await api
  .query('/products')
  .where('price', gt(1000))
  .get();
```

### Greater Than or Equals (`gte`)

Include the threshold value:

```typescript
import { gte } from '@pubflow/flowfull-client';

// Find users 21 or older
const users = await api
  .query('/users')
  .where('age', gte(21))
  .get();
```

### Less Than (`lt`)

Find values below a threshold:

```typescript
import { lt } from '@pubflow/flowfull-client';

// Find budget products
const budget = await api
  .query('/products')
  .where('price', lt(50))
  .get();
```

### Less Than or Equals (`lte`)

Include the threshold value:

```typescript
import { lte } from '@pubflow/flowfull-client';

// Find products $100 or less
const affordable = await api
  .query('/products')
  .where('price', lte(100))
  .get();
```

---

## 📝 String Operators

### Like (`like`)

Case-sensitive pattern matching:

```typescript
import { like } from '@pubflow/flowfull-client';

// Find users with "john" in their name (case-sensitive)
const users = await api
  .query('/users')
  .where('name', like('john'))
  .get();
```

### Case-Insensitive Like (`ilike`)

Pattern matching that ignores case:

```typescript
import { ilike } from '@pubflow/flowfull-client';

// Find users with "JOHN" in any case
const users = await api
  .query('/users')
  .where('name', ilike('JOHN'))  // Matches "john", "John", "JOHN"
  .get();
```

### Starts With (`startsWith` / `sw`)

Find strings that start with a specific prefix:

```typescript
import { startsWith } from '@pubflow/flowfull-client';

// Find users with titles
const titled = await api
  .query('/users')
  .where('name', startsWith('Mr.'))
  .get();

// Find phone numbers from a specific area
const local = await api
  .query('/contacts')
  .where('phone', startsWith('+1-555'))
  .get();
```

### Ends With (`endsWith` / `ew`)

Find strings that end with a specific suffix:

```typescript
import { endsWith } from '@pubflow/flowfull-client';

// Find Gmail users
const gmailUsers = await api
  .query('/users')
  .where('email', endsWith('@gmail.com'))
  .get();

// Find image files
const images = await api
  .query('/files')
  .where('filename', endsWith('.jpg'))
  .get();
```

---

## 📦 Array Operators

### In (`in` / `inOp`)

Match any value in an array:

```typescript
import { inOp } from '@pubflow/flowfull-client';

// Find users with specific statuses
const users = await api
  .query('/users')
  .where('status', inOp(['active', 'pending', 'verified']))
  .get();

// Find products in specific categories
const products = await api
  .query('/products')
  .where('category', inOp(['electronics', 'computers', 'phones']))
  .get();
```

### Not In (`notIn` / `nin`)

Exclude values in an array:

```typescript
import { notIn } from '@pubflow/flowfull-client';

// Exclude banned and deleted users
const validUsers = await api
  .query('/users')
  .where('status', notIn(['banned', 'deleted', 'suspended']))
  .get();
```

---

## ❓ Null Operators

### Is Null (`isNull`)

Find records where a field is null:

```typescript
import { isNull } from '@pubflow/flowfull-client';

// Find users who haven't been deleted
const activeUsers = await api
  .query('/users')
  .where('deleted_at', isNull())
  .get();

// Find unverified users
const unverified = await api
  .query('/users')
  .where('verified_at', isNull())
  .get();
```

### Is Not Null (`isNotNull`)

Find records where a field has a value:

```typescript
import { isNotNull } from '@pubflow/flowfull-client';

// Find verified users
const verified = await api
  .query('/users')
  .where('verified_at', isNotNull())
  .get();

// Find products with images
const withImages = await api
  .query('/products')
  .where('image_url', isNotNull())
  .get();
```

---

## 📊 Range Operators

### Between (`between`)

Find values within a range (inclusive):

```typescript
import { between } from '@pubflow/flowfull-client';

// Find products in a price range
const midRange = await api
  .query('/products')
  .where('price', between(50, 200))
  .get();

// Find users in an age range
const millennials = await api
  .query('/users')
  .where('age', between(25, 40))
  .get();
```

### Not Between (`notBetween`)

Exclude values within a range:

```typescript
import { notBetween } from '@pubflow/flowfull-client';

// Exclude minors
const adults = await api
  .query('/users')
  .where('age', notBetween(0, 17))
  .get();
```

---

## 🔗 Combining Operators

You can combine multiple operators for complex queries:

```typescript
import { gte, lt, inOp, isNotNull } from '@pubflow/flowfull-client';

const products = await api
  .query('/products')
  .where('status', inOp(['active', 'featured']))
  .where('price', gte(50))
  .where('price', lt(500))
  .where('stock', gte(1))
  .where('image_url', isNotNull())
  .get();
```

---

## 💡 Pro Tips

1. **Use shorthand for equals**: `where('status', 'active')` instead of `where('status', eq('active'))`
2. **Chain multiple filters**: Each `where()` call adds a new filter
3. **Use aliases**: `sw()` is shorter than `startsWith()`
4. **Combine with pagination**: Add `.page(1).limit(20)` to any query
5. **Type safety**: All operators are fully typed in TypeScript

---

## 🎯 Real-World Examples

### E-commerce Product Search

```typescript
const laptops = await api
  .query('/products')
  .search('laptop')
  .where('category', 'electronics')
  .where('price', between(500, 2000))
  .where('stock', gte(1))
  .where('rating', gte(4))
  .sort('price', 'asc')
  .page(1)
  .limit(20)
  .get();
```

### User Management

```typescript
const activeVerifiedUsers = await api
  .query('/users')
  .where('status', 'active')
  .where('verified_at', isNotNull())
  .where('role', notIn(['banned', 'suspended']))
  .where('created_at', gte('2024-01-01'))
  .sort('created_at', 'desc')
  .get();
```

### Order Filtering

```typescript
const recentOrders = await api
  .query('/orders')
  .where('status', inOp(['pending', 'processing', 'shipped']))
  .where('total', gte(100))
  .where('created_at', gte('2024-12-01'))
  .sort('created_at', 'desc')
  .limit(50)
  .get();
```

---

**Next:** [Query Builder Guide](./query-builder.md)

