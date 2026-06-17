/**
 * Next.js Server Integration
 *
 * Server-side helpers that do not require a hard dependency on next/*.
 */

import { createFlowfull } from '../factory';
import type { FlowfullClient } from '../core/client';
import type { FlowfullConfig } from '../types';
import { PUBFLOW_SESSION_KEYS } from '../session';

type CookieReader =
  | { get: (name: string) => { value?: string } | string | undefined }
  | Map<string, string>;

export interface CreateServerFlowfullOptions extends Omit<FlowfullConfig, 'headers'> {
  cookies?: CookieReader;
  headers?: Headers | Record<string, string | string[] | undefined>;
  clientHeaders?: FlowfullConfig['headers'];
}

function getHeader(headers: CreateServerFlowfullOptions['headers'], name: string): string | null {
  if (!headers) return null;

  if (headers instanceof Headers) {
    return headers.get(name);
  }

  const value = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function getCookie(cookies: CookieReader | undefined, name: string): string | null {
  if (!cookies) return null;

  if (cookies instanceof Map) {
    return cookies.get(name) ?? null;
  }

  const value = cookies.get(name);
  if (typeof value === 'string') return value;
  return value?.value ?? null;
}

export function getPubflowServerSessionId({
  sessionId,
  cookies,
  headers,
}: Pick<CreateServerFlowfullOptions, 'sessionId' | 'cookies' | 'headers'>): string | null {
  if (sessionId) return sessionId;

  const headerSession = getHeader(headers, 'x-session-id');
  if (headerSession) return headerSession;

  for (const key of PUBFLOW_SESSION_KEYS) {
    const value = getCookie(cookies, key);
    if (value) return value;
  }

  return null;
}

export function createServerFlowfull(
  baseUrl: string,
  config: CreateServerFlowfullOptions = {}
): FlowfullClient {
  const { cookies, headers, clientHeaders, ...clientConfig } = config;

  return createFlowfull(baseUrl, {
    ...clientConfig,
    headers: clientHeaders,
    sessionId: getPubflowServerSessionId({ sessionId: clientConfig.sessionId, cookies, headers }) ?? undefined,
  });
}
