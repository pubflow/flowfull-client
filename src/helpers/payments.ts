/**
 * Payments Helper
 * 
 * Provides clean interface for Bridge Payments API
 * This is syntactic sugar over standard HTTP requests to /bridge-payment/* endpoints
 */

import type { FlowfullClient } from '../core/client';
import type {
  CreatePaymentIntentRequest,
  PaymentIntent,
  Payment,
  PaymentMethod,
  UpdatePaymentMethodRequest,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  Subscription,
  CreateSubscriptionRequest,
  CancelSubscriptionRequest,
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationMember,
  AddOrganizationMemberRequest,
  UpdateOrganizationMemberRoleRequest,
  ConvertGuestToUserRequest,
  ConvertGuestToUserResponse,
  PaginationParams,
  ApiResponse
} from '../types';

/**
 * Payments API Helper
 * 
 * Provides a clean, intuitive interface for Bridge Payments API
 */
export class PaymentsHelper {
  constructor(private client: FlowfullClient) {}

  // ============================================================================
  // PAYMENT INTENTS
  // ============================================================================

  /**
   * Create a payment intent
   * 
   * @param data - Payment intent data
   * @returns Payment intent
   * 
   * @example
   * ```typescript
   * const intent = await api.pay.createIntent({
   *   total_cents: 9999,
   *   currency: 'USD',
   *   provider_id: 'stripe_main'
   * });
   * ```
   */
  async createIntent(data: CreatePaymentIntentRequest): Promise<ApiResponse<PaymentIntent>> {
    return this.client.post<PaymentIntent>('/bridge-payment/payments/intents', data);
  }

  /**
   * Get payment intent by ID
   * 
   * @param id - Payment intent ID
   * @returns Payment intent
   * 
   * @example
   * ```typescript
   * const intent = await api.pay.getIntent('intent_abc123');
   * ```
   */
  async getIntent(id: string): Promise<ApiResponse<PaymentIntent>> {
    return this.client.get<PaymentIntent>(`/bridge-payment/payments/intents/${id}`);
  }

  // ============================================================================
  // PAYMENTS
  // ============================================================================

  /**
   * List payments
   * 
   * @param params - Pagination parameters
   * @returns List of payments
   * 
   * @example
   * ```typescript
   * const payments = await api.pay.listPayments({ page: 1, limit: 10 });
   * ```
   */
  async listPayments(params?: PaginationParams): Promise<ApiResponse<Payment[]>> {
    return this.client.get<Payment[]>('/bridge-payment/payments', { params });
  }

  /**
   * Get payment by ID
   * 
   * @param id - Payment ID
   * @returns Payment
   * 
   * @example
   * ```typescript
   * const payment = await api.pay.getPayment('pay_abc123');
   * ```
   */
  async getPayment(id: string): Promise<ApiResponse<Payment>> {
    return this.client.get<Payment>(`/bridge-payment/payments/${id}`);
  }

  // ============================================================================
  // PAYMENT METHODS
  // ============================================================================

  /**
   * List payment methods
   * 
   * @param params - Pagination parameters
   * @returns List of payment methods
   * 
   * @example
   * ```typescript
   * const methods = await api.pay.listMethods();
   * ```
   */
  async listMethods(params?: PaginationParams): Promise<ApiResponse<PaymentMethod[]>> {
    return this.client.get<PaymentMethod[]>('/bridge-payment/payment-methods', { params });
  }

  /**
   * Get payment method by ID
   * 
   * @param id - Payment method ID
   * @returns Payment method
   * 
   * @example
   * ```typescript
   * const method = await api.pay.getMethod('pm_abc123');
   * ```
   */
  async getMethod(id: string): Promise<ApiResponse<PaymentMethod>> {
    return this.client.get<PaymentMethod>(`/bridge-payment/payment-methods/${id}`);
  }

  /**
   * Update payment method
   *
   * @param id - Payment method ID
   * @param data - Update data
   * @returns Updated payment method
   *
   * @example
   * ```typescript
   * await api.pay.updateMethod('pm_abc123', { is_default: true });
   * ```
   */
  async updateMethod(id: string, data: UpdatePaymentMethodRequest): Promise<ApiResponse<PaymentMethod>> {
    return this.client.put<PaymentMethod>(`/bridge-payment/payment-methods/${id}`, data);
  }

  /**
   * Delete payment method
   *
   * @param id - Payment method ID
   *
   * @example
   * ```typescript
   * await api.pay.deleteMethod('pm_abc123');
   * ```
   */
  async deleteMethod(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/bridge-payment/payment-methods/${id}`);
  }

  // ============================================================================
  // ADDRESSES
  // ============================================================================

  /**
   * Create address
   *
   * @param data - Address data
   * @returns Created address
   *
   * @example
   * ```typescript
   * const address = await api.pay.createAddress({
   *   address_type: 'billing',
   *   name: 'John Doe',
   *   line1: '123 Main St',
   *   city: 'New York',
   *   postal_code: '10001',
   *   country: 'US'
   * });
   * ```
   */
  async createAddress(data: CreateAddressRequest): Promise<ApiResponse<Address>> {
    return this.client.post<Address>('/bridge-payment/addresses', data);
  }

  /**
   * List addresses
   *
   * @param params - Pagination parameters
   * @returns List of addresses
   *
   * @example
   * ```typescript
   * const addresses = await api.pay.listAddresses();
   * ```
   */
  async listAddresses(params?: PaginationParams): Promise<ApiResponse<Address[]>> {
    return this.client.get<Address[]>('/bridge-payment/addresses', { params });
  }

  /**
   * Get address by ID
   *
   * @param id - Address ID
   * @returns Address
   *
   * @example
   * ```typescript
   * const address = await api.pay.getAddress('addr_abc123');
   * ```
   */
  async getAddress(id: string): Promise<ApiResponse<Address>> {
    return this.client.get<Address>(`/bridge-payment/addresses/${id}`);
  }

  /**
   * Update address
   *
   * @param id - Address ID
   * @param data - Update data
   * @returns Updated address
   *
   * @example
   * ```typescript
   * await api.pay.updateAddress('addr_abc123', { is_default: true });
   * ```
   */
  async updateAddress(id: string, data: UpdateAddressRequest): Promise<ApiResponse<Address>> {
    return this.client.put<Address>(`/bridge-payment/addresses/${id}`, data);
  }

  /**
   * Delete address
   *
   * @param id - Address ID
   *
   * @example
   * ```typescript
   * await api.pay.deleteAddress('addr_abc123');
   * ```
   */
  async deleteAddress(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/bridge-payment/addresses/${id}`);
  }

  // ============================================================================
  // CUSTOMERS
  // ============================================================================

  /**
   * Create customer
   *
   * @param data - Customer data
   * @returns Created customer
   *
   * @example
   * ```typescript
   * const customer = await api.pay.createCustomer({
   *   email: 'user@example.com',
   *   name: 'John Doe'
   * });
   * ```
   */
  async createCustomer(data: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    return this.client.post<Customer>('/bridge-payment/customers', data);
  }

  /**
   * List customers
   *
   * @param params - Pagination parameters
   * @returns List of customers
   *
   * @example
   * ```typescript
   * const customers = await api.pay.listCustomers();
   * ```
   */
  async listCustomers(params?: PaginationParams): Promise<ApiResponse<Customer[]>> {
    return this.client.get<Customer[]>('/bridge-payment/customers', { params });
  }

  /**
   * Get customer by ID
   *
   * @param id - Customer ID
   * @returns Customer
   *
   * @example
   * ```typescript
   * const customer = await api.pay.getCustomer('cus_abc123');
   * ```
   */
  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return this.client.get<Customer>(`/bridge-payment/customers/${id}`);
  }

  /**
   * Update customer
   *
   * @param id - Customer ID
   * @param data - Update data
   * @returns Updated customer
   *
   * @example
   * ```typescript
   * await api.pay.updateCustomer('cus_abc123', { name: 'Jane Doe' });
   * ```
   */
  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<ApiResponse<Customer>> {
    return this.client.put<Customer>(`/bridge-payment/customers/${id}`, data);
  }

  /**
   * Delete customer
   *
   * @param id - Customer ID
   *
   * @example
   * ```typescript
   * await api.pay.deleteCustomer('cus_abc123');
   * ```
   */
  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/bridge-payment/customers/${id}`);
  }

  // ============================================================================
  // SUBSCRIPTIONS
  // ============================================================================

  /**
   * Create subscription
   *
   * @param data - Subscription data
   * @returns Created subscription
   *
   * @example
   * ```typescript
   * const subscription = await api.pay.createSubscription({
   *   customer_id: 'cus_abc123',
   *   payment_method_id: 'pm_abc123',
   *   product_id: 'prod_premium',
   *   trial_days: 14
   * });
   * ```
   */
  async createSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<Subscription>> {
    return this.client.post<Subscription>('/bridge-payment/subscriptions', data);
  }

  /**
   * List subscriptions
   *
   * @param params - Pagination parameters
   * @returns List of subscriptions
   *
   * @example
   * ```typescript
   * const subscriptions = await api.pay.listSubscriptions();
   * ```
   */
  async listSubscriptions(params?: PaginationParams): Promise<ApiResponse<Subscription[]>> {
    return this.client.get<Subscription[]>('/bridge-payment/subscriptions', { params });
  }

  /**
   * Get subscription by ID
   *
   * @param id - Subscription ID
   * @returns Subscription
   *
   * @example
   * ```typescript
   * const subscription = await api.pay.getSubscription('sub_abc123');
   * ```
   */
  async getSubscription(id: string): Promise<ApiResponse<Subscription>> {
    return this.client.get<Subscription>(`/bridge-payment/subscriptions/${id}`);
  }

  /**
   * Cancel subscription
   *
   * @param id - Subscription ID
   * @param data - Cancellation options
   * @returns Updated subscription
   *
   * @example
   * ```typescript
   * await api.pay.cancelSubscription('sub_abc123', {
   *   cancel_at_period_end: true,
   *   reason: 'User requested'
   * });
   * ```
   */
  async cancelSubscription(id: string, data?: CancelSubscriptionRequest): Promise<ApiResponse<Subscription>> {
    return this.client.post<Subscription>(`/bridge-payment/subscriptions/${id}/cancel`, data || {});
  }

  // ============================================================================
  // ORGANIZATIONS
  // ============================================================================

  /**
   * Create organization
   *
   * @param data - Organization data
   * @returns Created organization
   *
   * @example
   * ```typescript
   * const org = await api.pay.createOrganization({
   *   name: 'Acme Corp',
   *   business_email: 'billing@acme.com'
   * });
   * ```
   */
  async createOrganization(data: CreateOrganizationRequest): Promise<ApiResponse<Organization>> {
    return this.client.post<Organization>('/bridge-payment/organizations', data);
  }

  /**
   * List organizations
   *
   * @param params - Pagination parameters
   * @returns List of organizations
   *
   * @example
   * ```typescript
   * const orgs = await api.pay.listOrganizations();
   * ```
   */
  async listOrganizations(params?: PaginationParams): Promise<ApiResponse<Organization[]>> {
    return this.client.get<Organization[]>('/bridge-payment/organizations', { params });
  }

  /**
   * Get organization by ID
   *
   * @param id - Organization ID
   * @returns Organization
   *
   * @example
   * ```typescript
   * const org = await api.pay.getOrganization('org_abc123');
   * ```
   */
  async getOrganization(id: string): Promise<ApiResponse<Organization>> {
    return this.client.get<Organization>(`/bridge-payment/organizations/${id}`);
  }

  /**
   * Update organization
   *
   * @param id - Organization ID
   * @param data - Update data
   * @returns Updated organization
   *
   * @example
   * ```typescript
   * await api.pay.updateOrganization('org_abc123', { name: 'Acme Inc' });
   * ```
   */
  async updateOrganization(id: string, data: UpdateOrganizationRequest): Promise<ApiResponse<Organization>> {
    return this.client.put<Organization>(`/bridge-payment/organizations/${id}`, data);
  }

  /**
   * Delete organization
   *
   * @param id - Organization ID
   *
   * @example
   * ```typescript
   * await api.pay.deleteOrganization('org_abc123');
   * ```
   */
  async deleteOrganization(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/bridge-payment/organizations/${id}`);
  }

  // ============================================================================
  // ORGANIZATION MEMBERS
  // ============================================================================

  /**
   * List organization members
   *
   * @param organizationId - Organization ID
   * @param params - Pagination parameters
   * @returns List of organization members
   *
   * @example
   * ```typescript
   * const members = await api.pay.listOrgMembers('org_abc123');
   * ```
   */
  async listOrgMembers(organizationId: string, params?: PaginationParams): Promise<ApiResponse<OrganizationMember[]>> {
    return this.client.get<OrganizationMember[]>(`/bridge-payment/organizations/${organizationId}/members`, { params });
  }

  /**
   * Add organization member
   *
   * @param organizationId - Organization ID
   * @param data - Member data
   * @returns Created member
   *
   * @example
   * ```typescript
   * await api.pay.addOrgMember('org_abc123', {
   *   email: 'user@example.com',
   *   role: 'admin'
   * });
   * ```
   */
  async addOrgMember(organizationId: string, data: AddOrganizationMemberRequest): Promise<ApiResponse<OrganizationMember>> {
    return this.client.post<OrganizationMember>(`/bridge-payment/organizations/${organizationId}/members`, data);
  }

  /**
   * Update organization member role
   *
   * @param organizationId - Organization ID
   * @param memberId - Member ID
   * @param data - Update data
   * @returns Updated member
   *
   * @example
   * ```typescript
   * await api.pay.updateOrgMemberRole('org_abc123', 'member_xyz', {
   *   role: 'billing'
   * });
   * ```
   */
  async updateOrgMemberRole(organizationId: string, memberId: string, data: UpdateOrganizationMemberRoleRequest): Promise<ApiResponse<OrganizationMember>> {
    return this.client.put<OrganizationMember>(`/bridge-payment/organizations/${organizationId}/members/${memberId}`, data);
  }

  /**
   * Remove organization member
   *
   * @param organizationId - Organization ID
   * @param memberId - Member ID
   *
   * @example
   * ```typescript
   * await api.pay.removeOrgMember('org_abc123', 'member_xyz');
   * ```
   */
  async removeOrgMember(organizationId: string, memberId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/bridge-payment/organizations/${organizationId}/members/${memberId}`);
  }

  /**
   * Leave organization (current user)
   *
   * @param organizationId - Organization ID
   *
   * @example
   * ```typescript
   * await api.pay.leaveOrganization('org_abc123');
   * ```
   */
  async leaveOrganization(organizationId: string): Promise<ApiResponse<void>> {
    return this.client.post<void>(`/bridge-payment/organizations/${organizationId}/leave`, {});
  }

  // ============================================================================
  // GUEST CONVERSION
  // ============================================================================

  /**
   * Convert guest payments to authenticated user
   *
   * @param data - Conversion data
   * @returns Conversion result
   *
   * @example
   * ```typescript
   * const result = await api.pay.convertGuest({
   *   guest_email: 'guest@example.com'
   * });
   * console.log(`Converted ${result.data.payments_count} payments`);
   * ```
   */
  async convertGuest(data: ConvertGuestToUserRequest): Promise<ApiResponse<ConvertGuestToUserResponse>> {
    return this.client.post<ConvertGuestToUserResponse>('/bridge-payment/guest/convert', data);
  }
}

