# React Native - Payments API Integration

Complete guide for using Bridge Payments API in React Native (Expo) applications.

## 📦 Installation

```bash
npx expo install @pubflow/flowfull-client
```

## 🚀 Quick Start

```tsx
import { createFlowfull } from '@pubflow/flowfull-client';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const api = createFlowfull(process.env.EXPO_PUBLIC_API_URL!);

export default function CheckoutScreen() {
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
      // Process with Stripe SDK
    }
    
    setLoading(false);
  }

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity 
        onPress={handlePayment}
        disabled={loading}
        style={{
          backgroundColor: '#007AFF',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center'
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Pay $99.99
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
```

## 💳 Complete Examples

### 1. Payment Methods List

```tsx
import { createFlowfull, PaymentMethod } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

const api = createFlowfull(process.env.EXPO_PUBLIC_API_URL!);

export default function PaymentMethodsScreen() {
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
      loadPaymentMethods(); // Reload
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      
      {methods.length === 0 ? (
        <Text style={styles.empty}>No payment methods saved</Text>
      ) : (
        <FlatList
          data={methods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.brand}>{item.brand?.toUpperCase()}</Text>
                <Text style={styles.last4}>•••• {item.last4}</Text>
                <Text style={styles.expiry}>
                  {item.exp_month}/{item.exp_year}
                </Text>
              </View>
              
              {item.is_default && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Default</Text>
                </View>
              )}
              
              <TouchableOpacity
                onPress={() => deleteMethod(item.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32
  },
  error: {
    color: '#ff3b30',
    fontSize: 16
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardInfo: {
    flex: 1
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  last4: {
    fontSize: 14,
    color: '#666'
  },
  expiry: {
    fontSize: 12,
    color: '#999',
    marginTop: 4
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  deleteBtn: {
    padding: 8
  },
  deleteBtnText: {
    color: '#ff3b30',
    fontSize: 14
  }
});
```

### 2. Checkout with Stripe (React Native)

```tsx
import { createFlowfull } from '@pubflow/flowfull-client';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const api = createFlowfull(process.env.EXPO_PUBLIC_API_URL!);

export default function CheckoutScreen({ amount }: { amount: number }) {
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);

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
      const { error, paymentIntent } = await confirmPayment(intent.client_secret!, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Success', 'Payment completed successfully!');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.amount}>Total: ${(amount / 100).toFixed(2)}</Text>

      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
      />

      <TouchableOpacity
        onPress={handlePayment}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  amount: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24
  },
  cardContainer: {
    height: 50,
    marginVertical: 20
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
```

### 3. Subscription Management

```tsx
import { createFlowfull, Subscription } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';

const api = createFlowfull(process.env.EXPO_PUBLIC_API_URL!);

export default function SubscriptionsScreen() {
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
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel this subscription?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            const response = await api.pay.cancelSubscription(id, {
              cancel_at_period_end: true,
              reason: 'User requested cancellation'
            });

            if (response.success) {
              loadSubscriptions();
              Alert.alert('Success', 'Subscription cancelled');
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Subscriptions</Text>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.subInfo}>
              <Text style={styles.productId}>{item.product_id}</Text>
              <Text style={styles.status}>{item.status}</Text>
              {item.current_period_end && (
                <Text style={styles.renewDate}>
                  Renews: {new Date(item.current_period_end).toLocaleDateString()}
                </Text>
              )}
            </View>

            {item.status === 'active' && (
              <TouchableOpacity
                onPress={() => cancelSubscription(item.id)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subInfo: {
    flex: 1
  },
  productId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  status: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4
  },
  renewDate: {
    fontSize: 12,
    color: '#666'
  },
  cancelBtn: {
    padding: 8
  },
  cancelBtnText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '600'
  }
});
```

### 4. Address Management (React Native)

```tsx
import { createFlowfull, Address } from '@pubflow/flowfull-client';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet
} from 'react-native';

const api = createFlowfull(process.env.EXPO_PUBLIC_API_URL!);

export default function AddressBookScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    const response = await api.pay.listAddresses();

    if (response.success && response.data) {
      setAddresses(response.data);
    }
  }

  async function deleteAddress(id: string) {
    const response = await api.pay.deleteAddress(id);

    if (response.success) {
      loadAddresses();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Addresses</Text>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.addressInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.line}>{item.line1}</Text>
              {item.line2 && <Text style={styles.line}>{item.line2}</Text>}
              <Text style={styles.line}>
                {item.city}, {item.state} {item.postal_code}
              </Text>
              <Text style={styles.line}>{item.country}</Text>
            </View>

            <TouchableOpacity
              onPress={() => deleteAddress(item.id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <AddressFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          loadAddresses();
        }}
      />
    </View>
  );
}

function AddressFormModal({ visible, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: '',
    line1: '',
    city: '',
    postal_code: '',
    country: 'US'
  });

  async function handleSubmit() {
    const response = await api.pay.createAddress({
      address_type: 'shipping',
      ...formData
    });

    if (response.success) {
      onSuccess();
    }
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Add New Address</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Address Line 1"
          value={formData.line1}
          onChangeText={(text) => setFormData({ ...formData, line1: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          value={formData.postal_code}
          onChangeText={(text) => setFormData({ ...formData, postal_code: text })}
        />

        <View style={styles.modalActions}>
          <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  addBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  addBtnText: {
    color: 'white',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  addressInfo: {
    marginBottom: 12
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  line: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  deleteBtn: {
    alignSelf: 'flex-start'
  },
  deleteBtnText: {
    color: '#ff3b30',
    fontSize: 14
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelBtnText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16
  }
});
```

## 🎯 Best Practices

### 1. Use Environment Variables

```typescript
// .env
EXPO_PUBLIC_API_URL=https://api.myapp.com

// app.tsx
const api = createFlowfull(process.env.EXPO_PUBLIC_API_URL!);
```

### 2. Create Custom Hooks

```typescript
// hooks/usePaymentMethods.ts
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function usePaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const response = await api.pay.listMethods();
    if (response.success && response.data) {
      setMethods(response.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { methods, loading, reload: load };
}
```

### 3. Handle Errors with Alerts

```typescript
import { Alert } from 'react-native';

async function handlePayment() {
  const response = await api.pay.createIntent({ ... });

  if (response.success && response.data) {
    Alert.alert('Success', 'Payment created!');
  } else {
    Alert.alert('Error', response.error || 'Payment failed');
  }
}
```

---

**See Also:**
- [Response Handling Guide](./response-handling.md)
- [Payments API Universal Documentation](../PAYMENTS-API-UNIVERSAL.md)
- [React Payments](./react-payments.md)
- [Next.js Payments](./nextjs-payments.md)



