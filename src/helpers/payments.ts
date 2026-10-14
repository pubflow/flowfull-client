import type { FlowfullClient } from '../core/client';
import type {
  ApiResponse,
  CancelSubscriptionRequest,
  CreateAddressRequest,
  CreateCustomerRequest,
  CreateOrganizationRequest,
  CreatePaymentIntentRequest,
  CreateSubscriptionRequest,
  PaginationParams,
  UpdateAddressRequest,
  UpdateCustomerRequest,
  UpdateOrganizationRequest,
  UpdatePaymentMethodRequest,
  AddOrganizationMemberRequest,
  UpdateOrganizationMemberRoleRequest,
  ConvertGuestToUserRequest,
  ConvertGuestToUserResponse,
  Address,
  Customer,
  Organization,
  OrganizationMember,
  Payment,
  PaymentIntent,
  PaymentMethod,
  Subscription
} from '../types';

export class PaymentsHelper {
  private readonly prefix: string;

  constructor(private client: FlowfullClient, prefix = '/bridge-payment') {
    this.prefix = prefix;
  }

  private path(path = ''): string {
    const cleanPrefix = `/${this.prefix}`.replace(/\/+/g, '/').replace(/\/$/, '');
    const cleanPath = path ? `/${path}`.replace(/\/+/g, '/') : '';
    return `${cleanPrefix}${cleanPath}`;
  }

  private url(path: string, params?: PaginationParams): string {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) query.set(key, String(value));
    });
    const base = `${this.client.getBaseUrl().replace(/\/+$/, '')}${this.path(path)}`;
    const suffix = query.toString();
    return suffix ? `${base}?${suffix}` : base;
  }

  private get<T = any>(path: string, params?: PaginationParams): Promise<ApiResponse<T>> {
    return this.client.get<T>(this.path(path), { params });
  }

  private post<T = any>(path: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post<T>(this.path(path), data || {});
  }

  private put<T = any>(path: string, data: any): Promise<ApiResponse<T>> {
    return this.client.put<T>(this.path(path), data);
  }

  private patch<T = any>(path: string, data: any): Promise<ApiResponse<T>> {
    return this.client.patch<T>(this.path(path), data);
  }

  private delete<T = any>(path: string): Promise<ApiResponse<T>> {
    return this.client.delete<T>(this.path(path));
  }

  createIntent(data: CreatePaymentIntentRequest): Promise<ApiResponse<PaymentIntent>> {
    return this.post<PaymentIntent>('/payments/intents', data);
  }

  getIntent(id: string): Promise<ApiResponse<PaymentIntent>> {
    return this.get<PaymentIntent>(`/payments/intents/${id}`);
  }

  updateIntent(id: string, data: Record<string, any>): Promise<ApiResponse<PaymentIntent>> {
    return this.patch<PaymentIntent>(`/payments/intents/${id}`, data);
  }

  confirmIntent(id: string, data?: Record<string, any>): Promise<ApiResponse<PaymentIntent>> {
    return this.post<PaymentIntent>(`/payments/intents/${id}/confirm`, data);
  }

  syncIntent(id: string, data?: Record<string, any>): Promise<ApiResponse<PaymentIntent>> {
    return this.post<PaymentIntent>(`/payments/intents/${id}/sync`, data);
  }

  listPayments(params?: PaginationParams): Promise<ApiResponse<Payment[]>> {
    return this.get<Payment[]>('/payments', params);
  }

  getPayment(id: string): Promise<ApiResponse<Payment>> {
    return this.get<Payment>(`/payments/${id}`);
  }

  cancelPayment(id: string, data?: Record<string, any>): Promise<ApiResponse<Payment>> {
    return this.post<Payment>(`/payments/${id}/cancel`, data);
  }

  capturePayment(id: string, data?: Record<string, any>): Promise<ApiResponse<Payment>> {
    return this.post<Payment>(`/payments/${id}/capture`, data);
  }

  listMethods(params?: PaginationParams): Promise<ApiResponse<PaymentMethod[]>> {
    return this.get<PaymentMethod[]>('/payment-methods', params);
  }

  createMethod(data: Record<string, any>): Promise<ApiResponse<PaymentMethod>> {
    return this.post<PaymentMethod>('/payment-methods', data);
  }

  createMethodDirect(data: Record<string, any>): Promise<ApiResponse<PaymentMethod>> {
    return this.post<PaymentMethod>('/payment-methods/direct', data);
  }

  getMethod(id: string): Promise<ApiResponse<PaymentMethod>> {
    return this.get<PaymentMethod>(`/payment-methods/${id}`);
  }

  listMethodsByCustomer(customerId: string, params?: PaginationParams): Promise<ApiResponse<PaymentMethod[]>> {
    return this.get<PaymentMethod[]>(`/payment-methods/customer/${customerId}`, params);
  }

  updateMethod(id: string, data: UpdatePaymentMethodRequest): Promise<ApiResponse<PaymentMethod>> {
    return this.put<PaymentMethod>(`/payment-methods/${id}`, data);
  }

  deleteMethod(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/payment-methods/${id}`);
  }

  updateMethodBillingAddress(id: string, billingAddressId: string | null): Promise<ApiResponse<PaymentMethod>> {
    return this.patch<PaymentMethod>(`/payment-methods/${id}/billing-address`, { billing_address_id: billingAddressId });
  }

  createAddress(data: CreateAddressRequest): Promise<ApiResponse<Address>> {
    return this.post<Address>('/addresses', data);
  }

  listAddresses(params?: PaginationParams): Promise<ApiResponse<Address[]>> {
    return this.get<Address[]>('/addresses', params);
  }

  getAddress(id: string): Promise<ApiResponse<Address>> {
    return this.get<Address>(`/addresses/${id}`);
  }

  updateAddress(id: string, data: UpdateAddressRequest): Promise<ApiResponse<Address>> {
    return this.put<Address>(`/addresses/${id}`, data);
  }

  deleteAddress(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/addresses/${id}`);
  }

  createCustomer(data: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    return this.post<Customer>('/customers', data);
  }

  listCustomers(params?: PaginationParams): Promise<ApiResponse<Customer[]>> {
    return this.get<Customer[]>('/customers', params);
  }

  getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return this.get<Customer>(`/customers/${id}`);
  }

  updateCustomer(id: string, data: UpdateCustomerRequest): Promise<ApiResponse<Customer>> {
    return this.put<Customer>(`/customers/${id}`, data);
  }

  deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/customers/${id}`);
  }

  createSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<Subscription>> {
    return this.post<Subscription>('/subscriptions', data);
  }

  listSubscriptions(params?: PaginationParams): Promise<ApiResponse<Subscription[]>> {
    return this.get<Subscription[]>('/subscriptions', params);
  }

  getSubscription(id: string): Promise<ApiResponse<Subscription>> {
    return this.get<Subscription>(`/subscriptions/${id}`);
  }

  updateSubscription(id: string, data: Record<string, any>): Promise<ApiResponse<Subscription>> {
    return this.patch<Subscription>(`/subscriptions/${id}`, data);
  }

  cancelSubscription(id: string, data?: CancelSubscriptionRequest): Promise<ApiResponse<Subscription>> {
    return this.post<Subscription>(`/subscriptions/${id}/cancel`, data || {});
  }

  updateSubscriptionBillingAddress(id: string, billingAddressId: string | null): Promise<ApiResponse<Subscription>> {
    return this.patch<Subscription>(`/subscriptions/${id}/billing-address`, { billing_address_id: billingAddressId });
  }

  listProducts(params?: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/products', params);
  }

  getProduct(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/products/${id}`);
  }

  listReceipts(params?: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/receipts', params);
  }

  getReceipt(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/receipts/${id}`);
  }

  listInvoices(params?: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/invoices', params);
  }

  getInvoice(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/invoices/${id}`);
  }

  createInvoice(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.post<any>('/invoices', data);
  }

  listOrders(params?: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/orders', params);
  }

  getOrder(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/orders/${id}`);
  }

  createOrder(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.post<any>('/orders', data);
  }

  createOrganization(data: CreateOrganizationRequest): Promise<ApiResponse<Organization>> {
    return this.post<Organization>('/organizations', data);
  }

  listOrganizations(params?: PaginationParams): Promise<ApiResponse<Organization[]>> {
    return this.get<Organization[]>('/organizations', params);
  }

  getOrganization(id: string): Promise<ApiResponse<Organization>> {
    return this.get<Organization>(`/organizations/${id}`);
  }

  updateOrganization(id: string, data: UpdateOrganizationRequest): Promise<ApiResponse<Organization>> {
    return this.put<Organization>(`/organizations/${id}`, data);
  }

  deleteOrganization(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/organizations/${id}`);
  }

  listOrgMembers(organizationId: string, params?: PaginationParams): Promise<ApiResponse<OrganizationMember[]>> {
    return this.get<OrganizationMember[]>(`/organizations/${organizationId}/members`, params);
  }

  addOrgMember(organizationId: string, data: AddOrganizationMemberRequest): Promise<ApiResponse<OrganizationMember>> {
    return this.post<OrganizationMember>(`/organizations/${organizationId}/members`, data);
  }

  updateOrgMemberRole(organizationId: string, memberId: string, data: UpdateOrganizationMemberRoleRequest): Promise<ApiResponse<OrganizationMember>> {
    return this.put<OrganizationMember>(`/organizations/${organizationId}/members/${memberId}`, data);
  }

  removeOrgMember(organizationId: string, memberId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/organizations/${organizationId}/members/${memberId}`);
  }

  leaveOrganization(organizationId: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/organizations/${organizationId}/leave`, {});
  }

  convertGuest(data: ConvertGuestToUserRequest): Promise<ApiResponse<ConvertGuestToUserResponse>> {
    return this.post<ConvertGuestToUserResponse>('/guest/convert', data);
  }

  previewGuest(email: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/guest-conversion/preview-guest/${encodeURIComponent(email)}`);
  }

  getMyGuestData(): Promise<ApiResponse<any>> {
    return this.get<any>('/guest-conversion/my-guest-data');
  }

  accountBalance = {
    mine: (params?: PaginationParams) => this.get('/account-balance/me/balances', params),
    user: (userId: string, params?: PaginationParams) => this.get(`/account-balance/users/${userId}/balances`, params),
    myTotal: (params?: PaginationParams) => this.get('/account-balance/me/total', params),
    userTotal: (userId: string, params?: PaginationParams) => this.get(`/account-balance/users/${userId}/total`, params),
    get: (id: string) => this.get(`/account-balance/${id}`),
    create: (data: Record<string, any>) => this.post('/account-balance', data),
    update: (id: string, data: Record<string, any>) => this.put(`/account-balance/${id}`, data),
    delete: (id: string) => this.delete(`/account-balance/${id}`),
    credit: (id: string, data: Record<string, any>) => this.post(`/account-balance/${id}/credit`, data),
    debit: (id: string, data: Record<string, any>) => this.post(`/account-balance/${id}/debit`, data),
    transactions: (id: string, params?: PaginationParams) => this.get(`/account-balance/${id}/transactions`, params),
    statistics: (id: string, params?: PaginationParams) => this.get(`/account-balance/${id}/statistics`, params),
    expiring: (params?: PaginationParams) => this.get('/account-balance/expiring', params),
  };

  billingSchedules = {
    mine: (params?: PaginationParams) => this.get('/billing-schedules/me', params),
    active: (params?: PaginationParams) => this.get('/billing-schedules/active', params),
    due: (params?: PaginationParams) => this.get('/billing-schedules/due', params),
    user: (userId: string, params?: PaginationParams) => this.get(`/billing-schedules/users/${userId}`, params),
    get: (id: string) => this.get(`/billing-schedules/${id}`),
    create: (data: Record<string, any>) => this.post('/billing-schedules', data),
    update: (id: string, data: Record<string, any>) => this.put(`/billing-schedules/${id}`, data),
    delete: (id: string) => this.delete(`/billing-schedules/${id}`),
    pause: (id: string) => this.post(`/billing-schedules/${id}/pause`, {}),
    resume: (id: string) => this.post(`/billing-schedules/${id}/resume`, {}),
    cancel: (id: string, data?: Record<string, any>) => this.post(`/billing-schedules/${id}/cancel`, data),
    executions: (id: string, params?: PaginationParams) => this.get(`/billing-schedules/${id}/executions`, params),
    statistics: (id: string, params?: PaginationParams) => this.get(`/billing-schedules/${id}/statistics`, params),
    failedExecutions: (params?: PaginationParams) => this.get('/billing-schedules/executions/failed', params),
  };

  costTracking = {
    productCosts: (productId: string, params?: PaginationParams) => this.get(`/cost-tracking/products/${productId}/costs`, params),
    activeProductCost: (productId: string, params?: PaginationParams) => this.get(`/cost-tracking/products/${productId}/costs/active`, params),
    totalProductCost: (productId: string, params?: PaginationParams) => this.get(`/cost-tracking/products/${productId}/costs/total`, params),
    createProductCost: (data: Record<string, any>) => this.post('/cost-tracking/products/costs', data),
    updateProductCost: (id: string, data: Record<string, any>) => this.put(`/cost-tracking/products/costs/${id}`, data),
    deleteProductCost: (id: string) => this.delete(`/cost-tracking/products/costs/${id}`),
    closeProductCost: (id: string, data?: Record<string, any>) => this.post(`/cost-tracking/products/costs/${id}/close`, data),
    orderCosts: (orderId: string, params?: PaginationParams) => this.get(`/cost-tracking/orders/${orderId}/costs`, params),
    orderCost: (orderId: string, params?: PaginationParams) => this.get(`/cost-tracking/orders/${orderId}/cost`, params),
    totalOrderCost: (orderId: string) => this.get(`/cost-tracking/orders/${orderId}/costs/total`),
    createOrderCost: (data: Record<string, any>) => this.post('/cost-tracking/orders/costs', data),
    subscriptionCost: (subscriptionId: string, params?: PaginationParams) => this.get(`/cost-tracking/subscriptions/${subscriptionId}/cost`, params),
    profitability: (params?: PaginationParams) => this.get('/cost-tracking/analytics/profitability', params),
    lowMargins: (params?: PaginationParams) => this.get('/cost-tracking/analytics/low-margins', params),
    losses: (params?: PaginationParams) => this.get('/cost-tracking/analytics/losses', params),
    topProfitable: (params?: PaginationParams) => this.get('/cost-tracking/analytics/top-profitable', params),
  };

  admin = {
    overview: () => this.get('/admin/overview'),
    stats: (params?: PaginationParams) => this.get('/admin/stats', params),
    payments: (params?: PaginationParams) => this.get('/admin/payments', params),
    cache: () => this.get('/admin/cache'),
    clearCache: () => this.delete('/admin/cache'),
    health: () => this.get('/admin/health'),
    testNotification: (data?: Record<string, any>) => this.post('/admin/test-notification', data),
    notificationConfig: () => this.get('/admin/notification-config'),
    updateNotificationConfig: (data: Record<string, any>) => this.put('/admin/notification-config', data),
    products: (params?: PaginationParams) => this.get('/admin/products', params),
    syncProducts: (data?: Record<string, any>) => this.post('/admin/products/sync', data),
    subscriptions: (params?: PaginationParams) => this.get('/admin/subscriptions', params),
    memberships: (params?: PaginationParams) => this.get('/admin/memberships', params),
    applePayDomains: (params?: PaginationParams) => this.get('/admin/apple-pay-domains', params),
    addApplePayDomain: (data: Record<string, any>) => this.post('/admin/apple-pay-domains', data),
    deleteApplePayDomain: (domain: string) => this.delete(`/admin/apple-pay-domains/${encodeURIComponent(domain)}`),
  };

  webhooks = {
    list: (params?: PaginationParams) => this.get('/webhooks', params),
    create: (data: Record<string, any>) => this.post('/webhooks', data),
    get: (id: string) => this.get(`/webhooks/${id}`),
    update: (id: string, data: Record<string, any>) => this.put(`/webhooks/${id}`, data),
    delete: (id: string) => this.delete(`/webhooks/${id}`),
    test: (id: string, data?: Record<string, any>) => this.post(`/webhooks/${id}/test`, data),
    deliveries: (id: string, params?: PaginationParams) => this.get(`/webhooks/${id}/deliveries`, params),
  };

  externalWebhooks = {
    receive: (provider: string, data: Record<string, any>) => this.post(`/external-webhooks/${provider}`, data),
    stripe: (data: Record<string, any>) => this.post('/external-webhooks/stripe', data),
    paypal: (data: Record<string, any>) => this.post('/external-webhooks/paypal', data),
    polar: (data: Record<string, any>) => this.post('/external-webhooks/polar', data),
    azul: (data: Record<string, any>) => this.post('/external-webhooks/azul', data),
  };

  memberships = {
    tiers: (params?: PaginationParams) => this.get('/memberships/tiers', params),
    mine: (params?: PaginationParams) => this.get('/memberships/me', params),
    list: (params?: PaginationParams) => this.get('/memberships', params),
    get: (id: string) => this.get(`/memberships/${id}`),
    cancel: (id: string, data?: Record<string, any>) => this.post(`/memberships/${id}/cancel`, data),
    user: (userId: string, params?: PaginationParams) => this.get(`/memberships/users/${userId}`, params),
    access: (data: Record<string, any>) => this.post('/memberships/access', data),
    projects: (params?: PaginationParams) => this.get('/memberships/projects', params),
  };

  projects = {
    list: (params?: PaginationParams) => this.get('/projects', params),
    create: (data: Record<string, any>) => this.post('/projects', data),
    get: (id: string) => this.get(`/projects/${id}`),
    update: (id: string, data: Record<string, any>) => this.put(`/projects/${id}`, data),
    delete: (id: string) => this.delete(`/projects/${id}`),
    invites: (projectId: string, params?: PaginationParams) => this.get(`/projects/${projectId}/invites`, params),
    invite: (projectId: string, data: Record<string, any>) => this.post(`/projects/${projectId}/invites`, data),
    acceptInvite: (token: string, data?: Record<string, any>) => this.post(`/projects/invites/${token}/accept`, data),
  };

  moduleHub = {
    plugins: (params?: PaginationParams) => this.get('/module-hub/plugins', params),
    plugin: (id: string) => this.get(`/module-hub/plugins/${id}`),
    install: (id: string, data?: Record<string, any>) => this.post(`/module-hub/plugins/${id}/install`, data),
    uninstall: (id: string, data?: Record<string, any>) => this.post(`/module-hub/plugins/${id}/uninstall`, data),
  };

  renewals = {
    list: (params?: PaginationParams) => this.get('/renewals', params),
    get: (id: string) => this.get(`/renewals/${id}`),
    run: (id: string, data?: Record<string, any>) => this.post(`/renewals/${id}/run`, data),
  };

  hosted = {
    meUrl: () => this.url('/pages/me'),
    payUrl: (params?: PaginationParams) => this.url('/pages/pay', params),
    loginUrl: (params?: PaginationParams) => this.url('/pages/login', params),
    portalUrl: (params?: PaginationParams) => this.url('/pages/portal', params),
    subscriptionsUrl: (params?: PaginationParams) => this.url('/pages/subscriptions', params),
    paymentMethodsUrl: (params?: PaginationParams) => this.url('/pages/payment-methods', params),
    addressesUrl: (params?: PaginationParams) => this.url('/pages/addresses', params),
    invoicesUrl: (params?: PaginationParams) => this.url('/pages/invoices', params),
    embedPayUrl: (params?: PaginationParams) => this.url('/embed/pay', params),
    embedLoginUrl: (params?: PaginationParams) => this.url('/embed/login', params),
    embedPortalUrl: (params?: PaginationParams) => this.url('/embed/portal', params),
    embedSubscriptionsUrl: (params?: PaginationParams) => this.url('/embed/subscriptions', params),
    embedPaymentMethodsUrl: (params?: PaginationParams) => this.url('/embed/payment-methods', params),
    embedButtonUrl: (params?: PaginationParams) => this.url('/embed/button', params),
    embedPaymentsUrl: (params?: PaginationParams) => this.url('/embed/payments', params),
  };

  callbacks = {
    azulApproved: (params?: PaginationParams) => this.get('/callbacks/azul/approved', params),
    azulDeclined: (params?: PaginationParams) => this.get('/callbacks/azul/declined', params),
    azulCancelled: (params?: PaginationParams) => this.get('/callbacks/azul/cancelled', params),
    polarReturn: (params?: PaginationParams) => this.get('/callbacks/polar/return', params),
    health: () => this.get('/callbacks/health'),
  };

  health = {
    basic: () => this.get('/health'),
    detailed: () => this.get('/health/detailed'),
    database: () => this.get('/health/database'),
    providers: () => this.get('/health/providers'),
    flowless: () => this.get('/health/flowless'),
    ready: () => this.get('/health/ready'),
    live: () => this.get('/health/live'),
    metrics: () => this.get('/health/metrics'),
  };
}
