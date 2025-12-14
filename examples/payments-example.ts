/**
 * Payments API Example
 * 
 * Complete example showing how to use api.pay for Bridge Payments
 */

import { createFlowfull } from '@pubflow/flowfull-client';

// Create Flowfull client
const api = createFlowfull('https://api.myapp.com');

// ============================================================================
// EXAMPLE 1: E-commerce Checkout Flow
// ============================================================================

async function ecommerceCheckout() {
  console.log('=== E-commerce Checkout ===\n');

  // 1. Create payment intent
  const intent = await api.pay.createIntent({
    total_cents: 9999,              // $99.99
    currency: 'USD',
    provider_id: 'stripe_main',
    description: 'Order #12345',
    save_payment_method: true       // Save card for future
  });

  console.log('Payment Intent:', intent.data);

  // 2. Process payment on frontend (Stripe.js, etc.)
  // ... handle payment with intent.data.client_secret

  // 3. List saved payment methods
  const methods = await api.pay.listMethods();
  console.log('Saved Payment Methods:', methods.data);

  // 4. Save shipping address
  const address = await api.pay.createAddress({
    address_type: 'shipping',
    name: 'John Doe',
    line1: '123 Main St',
    city: 'New York',
    postal_code: '10001',
    country: 'US'
  });

  console.log('Shipping Address:', address.data);
}

// ============================================================================
// EXAMPLE 2: Subscription Management
// ============================================================================

async function subscriptionManagement() {
  console.log('\n=== Subscription Management ===\n');

  // 1. Create customer
  const customer = await api.pay.createCustomer({
    email: 'user@example.com',
    name: 'John Doe'
  });

  console.log('Customer:', customer.data);

  // 2. Create subscription
  const subscription = await api.pay.createSubscription({
    customer_id: customer.data.id,
    payment_method_id: 'pm_abc123',
    product_id: 'prod_premium',
    trial_days: 14
  });

  console.log('Subscription:', subscription.data);

  // 3. List active subscriptions
  const subs = await api.pay.listSubscriptions();
  console.log('Active Subscriptions:', subs.data);

  // 4. Cancel subscription
  await api.pay.cancelSubscription(subscription.data.id, {
    cancel_at_period_end: true,
    reason: 'User downgraded'
  });

  console.log('Subscription cancelled');
}

// ============================================================================
// EXAMPLE 3: Guest Checkout
// ============================================================================

async function guestCheckout() {
  console.log('\n=== Guest Checkout ===\n');

  // 1. Guest creates payment
  const guestIntent = await api.pay.createIntent({
    total_cents: 4999,
    currency: 'USD',
    provider_id: 'stripe_main',
    guest_data: {
      email: 'guest@example.com',
      name: 'Jane Doe'
    }
  });

  console.log('Guest Payment Intent:', guestIntent.data);

  // 2. Later, user creates account
  await api.post('/auth/register', {
    email: 'guest@example.com',
    password: 'secure123'
  });

  // 3. Convert guest payments to user account
  const result = await api.pay.convertGuest({
    guest_email: 'guest@example.com'
  });

  console.log(`Transferred ${result.data.payments_count} payments`);
  console.log(`Transferred ${result.data.payment_methods_count} payment methods`);
  console.log(`Transferred ${result.data.addresses_count} addresses`);
}

// ============================================================================
// EXAMPLE 4: Organization/Team Payments
// ============================================================================

async function organizationPayments() {
  console.log('\n=== Organization Payments ===\n');

  // 1. Create organization
  const org = await api.pay.createOrganization({
    name: 'Acme Corp',
    business_email: 'billing@acme.com',
    tax_id: '12-3456789'
  });

  console.log('Organization:', org.data);

  // 2. Add team members
  await api.pay.addOrgMember(org.data.id, {
    email: 'admin@acme.com',
    role: 'admin'
  });

  await api.pay.addOrgMember(org.data.id, {
    email: 'finance@acme.com',
    role: 'billing'
  });

  console.log('Team members added');

  // 3. List members
  const members = await api.pay.listOrgMembers(org.data.id);
  console.log('Organization Members:', members.data);

  // 4. Create subscription for organization
  const orgSub = await api.pay.createSubscription({
    customer_id: 'cus_org_123',
    payment_method_id: 'pm_abc123',
    product_id: 'prod_enterprise'
  });

  console.log('Organization Subscription:', orgSub.data);
}

// ============================================================================
// EXAMPLE 5: Multi-Tenant Payments
// ============================================================================

async function multiTenantPayments() {
  console.log('\n=== Multi-Tenant Payments ===\n');

  // Create separate clients for different tenants
  const tenant1 = createFlowfull('https://api.myapp.com', {
    storageConfig: {
      adapter: localStorage,
      prefix: 'tenant1'
    }
  });

  const tenant2 = createFlowfull('https://api.myapp.com', {
    storageConfig: {
      adapter: localStorage,
      prefix: 'tenant2'
    }
  });

  // Each tenant has isolated payments
  const tenant1Intent = await tenant1.pay.createIntent({
    total_cents: 5000,
    currency: 'USD',
    provider_id: 'stripe_main'
  });

  const tenant2Intent = await tenant2.pay.createIntent({
    total_cents: 7500,
    currency: 'USD',
    provider_id: 'stripe_main'
  });

  console.log('Tenant 1 Intent:', tenant1Intent.data);
  console.log('Tenant 2 Intent:', tenant2Intent.data);
}

// ============================================================================
// EXAMPLE 6: Direct Endpoint Access (Alternative)
// ============================================================================

async function directEndpointAccess() {
  console.log('\n=== Direct Endpoint Access ===\n');

  // You can always use direct endpoints instead of api.pay
  // This is useful if you need custom parameters or headers

  // Using api.pay (recommended)
  const intent1 = await api.pay.createIntent({
    total_cents: 5000,
    currency: 'USD',
    provider_id: 'stripe_main'
  });

  // Using direct endpoint (alternative)
  const intent2 = await api.post('/bridge-payment/payments/intents', {
    total_cents: 5000,
    currency: 'USD',
    provider_id: 'stripe_main'
  });

  console.log('Both methods work the same!');
  console.log('api.pay is just syntactic sugar over direct endpoints');
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
  try {
    await ecommerceCheckout();
    await subscriptionManagement();
    await guestCheckout();
    await organizationPayments();
    await multiTenantPayments();
    await directEndpointAccess();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run
// runAllExamples();

