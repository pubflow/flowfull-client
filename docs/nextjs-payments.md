# Next.js - Payments API Integration

Complete guide for using Bridge Payments API in Next.js applications (App Router & Pages Router).

## 📦 Installation

```bash
npm install @pubflow/flowfull-client
```

## 🚀 Quick Start

### App Router (Recommended)

```tsx
// app/checkout/page.tsx
'use client';

import { createFlowfull } from '@pubflow/flowfull-client';
import { useState } from 'react';

const api = createFlowfull(process.env.NEXT_PUBLIC_API_URL!);

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);
    
    const response = await api.pay.createIntent({
      total_cents: 9999,
      currency: 'USD',
      provider_id: 'stripe_main'
    });
    
    if (response.success && response.data) {
      console.log('Payment intent:', response.data);
      // Process with Stripe
    }
    
    setLoading(false);
  }

  return (
    <div className="p-8">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay $99.99'}
      </button>
    </div>
  );
}
```

### Pages Router

```tsx
// pages/checkout.tsx
import { createFlowfull } from '@pubflow/flowfull-client';
import { useState } from 'react';

const api = createFlowfull(process.env.NEXT_PUBLIC_API_URL!);

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);
    
    const response = await api.pay.createIntent({
      total_cents: 9999,
      currency: 'USD',
      provider_id: 'stripe_main'
    });
    
    if (response.success && response.data) {
      console.log('Payment intent:', response.data);
    }
    
    setLoading(false);
  }

  return (
    <div className="p-8">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? 'Processing...' : 'Pay $99.99'}
      </button>
    </div>
  );
}
```

## 💳 Complete Examples

### 1. Payment Methods List (App Router)

```tsx
// app/payment-methods/page.tsx
'use client';

import { createFlowfull, PaymentMethod } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';

const api = createFlowfull(process.env.NEXT_PUBLIC_API_URL!);

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  async function loadPaymentMethods() {
    const response = await api.pay.listMethods();
    
    if (response.success && response.data) {
      setMethods(response.data);
    } else {
      setError(response.error || 'Failed to load payment methods');
    }
    
    setLoading(false);
  }

  async function deleteMethod(id: string) {
    const confirmed = window.confirm('Remove this payment method?');
    if (!confirmed) return;

    const response = await api.pay.deleteMethod(id);
    
    if (response.success) {
      loadPaymentMethods();
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>
      
      {methods.length === 0 ? (
        <p className="text-gray-600">No payment methods saved</p>
      ) : (
        <div className="space-y-4">
          {methods.map(method => (
            <div
              key={method.id}
              className="bg-white border rounded-lg p-6 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">
                    {method.brand?.toUpperCase()}
                  </span>
                  <span className="text-gray-600">
                    •••• {method.last4}
                  </span>
                  <span className="text-sm text-gray-500">
                    {method.exp_month}/{method.exp_year}
                  </span>
                </div>
                
                {method.is_default && (
                  <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              
              <button
                onClick={() => deleteMethod(method.id)}
                className="text-red-600 hover:text-red-800 px-4 py-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Checkout with Stripe (App Router)

```tsx
// app/checkout/page.tsx
'use client';

import { createFlowfull, PaymentIntent } from '@pubflow/flowfull-client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const api = createFlowfull(process.env.NEXT_PUBLIC_API_URL!);
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create payment intent
      const intentResponse = await api.pay.createIntent({
        total_cents: amount,
        currency: 'USD',
        provider_id: 'stripe_main',
        save_payment_method: true
      });

      if (!intentResponse.success || !intentResponse.data) {
        throw new Error(intentResponse.error || 'Failed to create payment');
      }

      const intent = intentResponse.data;

      // 2. Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intent.client_secret!,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p className="text-xl mb-6">Total: ${(amount / 100).toFixed(2)}</p>

      <div className="mb-6 p-4 border rounded-lg">
        <CardElement />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={9999} />
    </Elements>
  );
}
```

### 3. Server-Side Rendering with Payments

```tsx
// app/subscriptions/page.tsx
import { createFlowfull } from '@pubflow/flowfull-client';
import SubscriptionsList from './SubscriptionsList';

const api = createFlowfull(process.env.NEXT_PUBLIC_API_URL!);

// Server Component - Fetch data on server
export default async function SubscriptionsPage() {
  const response = await api.pay.listSubscriptions();

  const subscriptions = response.success && response.data ? response.data : [];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Subscriptions</h1>
      <SubscriptionsList initialData={subscriptions} />
    </div>
  );
}

// app/subscriptions/SubscriptionsList.tsx
'use client';

import { createFlowfull, Subscription } from '@pubflow/flowfull-client';
import { useState } from 'react';

const api = createFlowfull(process.env.NEXT_PUBLIC_API_URL!);

export default function SubscriptionsList({
  initialData
}: {
  initialData: Subscription[]
}) {
  const [subscriptions, setSubscriptions] = useState(initialData);

  async function cancelSubscription(id: string) {
    const confirmed = window.confirm('Cancel this subscription?');
    if (!confirmed) return;

    const response = await api.pay.cancelSubscription(id, {
      cancel_at_period_end: true,
      reason: 'User requested cancellation'
    });

    if (response.success) {
      // Reload
      const listResponse = await api.pay.listSubscriptions();
      if (listResponse.success && listResponse.data) {
        setSubscriptions(listResponse.data);
      }
    }
  }

  return (
    <div className="space-y-4">
      {subscriptions.map(sub => (
        <div key={sub.id} className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{sub.product_id}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className="text-blue-600">{sub.status}</span>
              </p>
              {sub.current_period_end && (
                <p className="text-sm text-gray-600 mt-1">
                  Renews: {new Date(sub.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>

            {sub.status === 'active' && (
              <button
                onClick={() => cancelSubscription(sub.id)}
                className="text-red-600 hover:text-red-800 px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 4. API Routes (Server-Side)

```typescript
// app/api/payments/create-intent/route.ts
import { createFlowfull } from '@pubflow/flowfull-client';
import { NextRequest, NextResponse } from 'next/server';

const api = createFlowfull(process.env.API_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await api.pay.createIntent({
      total_cents: body.amount,
      currency: 'USD',
      provider_id: 'stripe_main'
    });

    if (response.success && response.data) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: response.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// app/api/payments/methods/route.ts
export async function GET() {
  const response = await api.pay.listMethods();

  if (response.success && response.data) {
    return NextResponse.json(response.data);
  } else {
    return NextResponse.json(
      { error: response.error },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing payment method ID' },
      { status: 400 }
    );
  }

  const response = await api.pay.deleteMethod(id);

  if (response.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { error: response.error },
      { status: 400 }
    );
  }
}
```

### 5. Address Management (App Router)

```tsx
// app/addresses/page.tsx
'use client';

import { createFlowfull, Address, CreateAddressRequest } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';

const api = createFlowfull(process.env.NEXT_PUBLIC_API_URL!);

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    const response = await api.pay.listAddresses();

    if (response.success && response.data) {
      setAddresses(response.data);
    }
  }

  async function handleSubmit(data: CreateAddressRequest) {
    const response = await api.pay.createAddress(data);

    if (response.success) {
      setShowForm(false);
      loadAddresses();
    }
  }

  async function deleteAddress(id: string) {
    const response = await api.pay.deleteAddress(id);

    if (response.success) {
      loadAddresses();
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Saved Addresses</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Address
        </button>
      </div>

      {showForm && (
        <AddressForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-4 mt-6">
        {addresses.map(address => (
          <div key={address.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{address.name}</p>
                <p className="text-gray-600">{address.line1}</p>
                {address.line2 && <p className="text-gray-600">{address.line2}</p>}
                <p className="text-gray-600">
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p className="text-gray-600">{address.country}</p>
              </div>

              <button
                onClick={() => deleteAddress(address.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressForm({ onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState<CreateAddressRequest>({
    address_type: 'shipping',
    name: '',
    line1: '',
    city: '',
    postal_code: '',
    country: 'US'
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-bold mb-4">New Address</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="Address Line 1"
          value={formData.line1}
          onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="Postal Code"
          value={formData.postal_code}
          onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

## 🎯 Best Practices

### 1. Use Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.myapp.com
NEXT_PUBLIC_STRIPE_KEY=pk_test_...

# Server-only (no NEXT_PUBLIC prefix)
API_URL=https://api.myapp.com
```

### 2. Create API Instance

```typescript
// lib/api.ts
import { createFlowfull } from '@pubflow/flowfull-client';

export const api = createFlowfull(process.env.NEXT_PUBLIC_API_URL!);

// Usage in components
import { api } from '@/lib/api';
```

### 3. Use Server Components When Possible

```tsx
// ✅ Good - Server Component (faster initial load)
export default async function ProductsPage() {
  const response = await api.get('/products');
  return <ProductsList products={response.data} />;
}

// ❌ Less optimal - Client Component
'use client';
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data));
  }, []);
  return <ProductsList products={products} />;
}
```

### 4. Handle Errors Properly

```tsx
async function handlePayment() {
  try {
    const response = await api.pay.createIntent({ ... });

    if (response.success && response.data) {
      // Success
    } else {
      alert(response.error);
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
}
```

---

**See Also:**
- [Response Handling Guide](./response-handling.md)
- [Payments API Universal Documentation](../PAYMENTS-API-UNIVERSAL.md)
- [React Payments](./react-payments.md)
- [React Native Payments](./react-native-payments.md)



