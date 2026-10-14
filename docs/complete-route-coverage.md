# Complete Route Coverage

`@pubflow/flowfull-client` is the optional universal client. It stays at parity with `@pubflow/core` while still letting apps mount each backend URL and prefix themselves.

```ts
import { createClient } from '@pubflow/flowfull-client';

const api = createClient('https://flowless.example.com', {
  paymentsUrl: 'https://payments.example.com',
  formsUrl: 'https://forms.example.com',
  modulePrefixes: {
    payments: '/bridge-payment',
    forms: '/api/v1',
  },
});

await api.pay.webhooks.list();
await api.pay.hosted.portalUrl();
await api.forms.workflows.list();
await api.forms.tickets.create({ subject: 'Support request' });
```

The route-to-method matrix is maintained in `@pubflow/core/docs/complete-route-coverage.md`. `api.pay` and `api.forms` mirror the same Bridge Payments and Ultra Forms module families.
