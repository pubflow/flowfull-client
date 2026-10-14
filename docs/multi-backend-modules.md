# Multi-Backend Modules

`@pubflow/flowfull-client` remains the universal client for projects that want one lightweight HTTP client. It now exposes friendly helpers for Bridge Payments, Ultra Forms, Blog, and Onboarding while still allowing raw requests.

```ts
import { createFlowfull } from '@pubflow/flowfull-client';

const api = createFlowfull('https://flowless.example.com', {
  modulePrefixes: {
    payments: '/bridge-payment',
    forms: '/api/v1',
    blog: '/api/v1/posts',
    onboarding: '/api/v1/onboarding',
  },
});

await api.blog.listPosts({ lang: 'en' });
await api.forms.submitByCode('contact', { email: 'ada@example.com' });
await api.pay.createIntent({
  total_cents: 2500,
  currency: 'USD',
  provider_id: 'stripe_main',
});
```

For separate hosts, create one client per host:

```ts
const flowless = createFlowfull('https://flowless.example.com');
const payments = createFlowfull('https://payments.example.com');
const forms = createFlowfull('https://forms.example.com');

await flowless.blog.listPosts();
await payments.pay.listProducts();
await forms.forms.submitByCode('contact', values);
```

The helpers are convenience layers over `get`, `post`, `put`, `patch`, and `delete`, so unsupported module routes can still be called directly.
