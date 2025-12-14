# React - Payments API Integration

Complete guide for using Bridge Payments API in React applications.

## 📦 Installation

```bash
npm install @pubflow/flowfull-client
```

## 🚀 Quick Start

```tsx
import { createFlowfull } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';

const api = createFlowfull('https://api.myapp.com');

function CheckoutPage() {
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
      // Process with Stripe.js
    }
    
    setLoading(false);
  }

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay $99.99'}
    </button>
  );
}
```

## 💳 Complete Examples

### 1. Payment Methods List

```tsx
import { createFlowfull, PaymentMethod } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';

const api = createFlowfull('https://api.myapp.com');

export function PaymentMethodsList() {
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
    const response = await api.pay.deleteMethod(id);
    
    if (response.success) {
      // Reload list
      loadPaymentMethods();
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="payment-methods">
      <h2>Your Payment Methods</h2>
      
      {methods.length === 0 ? (
        <p>No payment methods saved</p>
      ) : (
        <div className="methods-list">
          {methods.map(method => (
            <div key={method.id} className="payment-card">
              <div className="card-info">
                <span className="brand">{method.brand?.toUpperCase()}</span>
                <span className="last4">•••• {method.last4}</span>
                <span className="expiry">{method.exp_month}/{method.exp_year}</span>
              </div>
              
              {method.is_default && (
                <span className="badge">Default</span>
              )}
              
              <button 
                onClick={() => deleteMethod(method.id)}
                className="btn-delete"
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

### 2. Checkout Flow with Stripe

```tsx
import { createFlowfull, PaymentIntent } from '@pubflow/flowfull-client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const api = createFlowfull('https://api.myapp.com');
const stripePromise = loadStripe('pk_test_...');

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

      // 2. Confirm payment with Stripe
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
      <div className="success">
        <h2>✅ Payment Successful!</h2>
        <p>Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <p className="amount">Total: ${(amount / 100).toFixed(2)}</p>
      
      <div className="card-element">
        <CardElement />
      </div>
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

export function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={9999} />
    </Elements>
  );
}
```

### 3. Subscription Management

```tsx
import { createFlowfull, Subscription } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';

const api = createFlowfull('https://api.myapp.com');

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  async function loadSubscriptions() {
    const response = await api.pay.listSubscriptions();

    if (response.success && response.data) {
      setSubscriptions(response.data);
    }

    setLoading(false);
  }

  async function cancelSubscription(id: string) {
    const confirmed = window.confirm('Are you sure you want to cancel?');
    if (!confirmed) return;

    const response = await api.pay.cancelSubscription(id, {
      cancel_at_period_end: true,
      reason: 'User requested cancellation'
    });

    if (response.success) {
      loadSubscriptions(); // Reload
    }
  }

  if (loading) return <div>Loading subscriptions...</div>;

  return (
    <div className="subscriptions">
      <h2>Your Subscriptions</h2>

      {subscriptions.map(sub => (
        <div key={sub.id} className="subscription-card">
          <div className="sub-info">
            <h3>{sub.product_id}</h3>
            <p className="status">{sub.status}</p>
            {sub.current_period_end && (
              <p>Renews: {new Date(sub.current_period_end).toLocaleDateString()}</p>
            )}
          </div>

          {sub.status === 'active' && (
            <button
              onClick={() => cancelSubscription(sub.id)}
              className="btn-cancel"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 4. Address Management

```tsx
import { createFlowfull, Address, CreateAddressRequest } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';

const api = createFlowfull('https://api.myapp.com');

export function AddressBook() {
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
    <div className="address-book">
      <div className="header">
        <h2>Saved Addresses</h2>
        <button onClick={() => setShowForm(true)}>Add New Address</button>
      </div>

      {showForm && (
        <AddressForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="addresses-list">
        {addresses.map(address => (
          <div key={address.id} className="address-card">
            <div className="address-info">
              <p className="name">{address.name}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p>{address.country}</p>
            </div>

            <button onClick={() => deleteAddress(address.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: CreateAddressRequest) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<CreateAddressRequest>({
    address_type: 'shipping',
    name: '',
    line1: '',
    city: '',
    postal_code: '',
    country: 'US'
  });

  function handleChange(field: keyof CreateAddressRequest, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Address Line 1"
        value={formData.line1}
        onChange={(e) => handleChange('line1', e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={(e) => handleChange('city', e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Postal Code"
        value={formData.postal_code}
        onChange={(e) => handleChange('postal_code', e.target.value)}
        required
      />

      <div className="form-actions">
        <button type="submit">Save Address</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
```

## 🎯 Best Practices

### 1. Create API Instance Once

```tsx
// ✅ Good - Create once, reuse everywhere
// src/lib/api.ts
import { createFlowfull } from '@pubflow/flowfull-client';

export const api = createFlowfull(process.env.REACT_APP_API_URL!);

// src/components/Checkout.tsx
import { api } from '../lib/api';

function Checkout() {
  const response = await api.pay.createIntent({ ... });
}
```

### 2. Use Custom Hooks

```tsx
// src/hooks/usePaymentMethods.ts
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { PaymentMethod } from '@pubflow/flowfull-client';

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const response = await api.pay.listMethods();

    if (response.success && response.data) {
      setMethods(response.data);
    } else {
      setError(response.error || 'Failed to load');
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { methods, loading, error, reload: load };
}

// Usage
function PaymentMethodsList() {
  const { methods, loading, error } = usePaymentMethods();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render methods */}</div>;
}
```

### 3. Handle Loading States

```tsx
function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      const response = await api.pay.createIntent({ ... });

      if (response.success && response.data) {
        // Success
      }
    } finally {
      setLoading(false);  // Always reset loading
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
```

---

**See Also:**
- [Response Handling Guide](./response-handling.md)
- [Payments API Universal Documentation](../PAYMENTS-API-UNIVERSAL.md)
- [React Native Payments](./react-native-payments.md)
- [Next.js Payments](./nextjs-payments.md)



