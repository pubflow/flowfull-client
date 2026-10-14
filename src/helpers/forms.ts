import type { ApiResponse, RequestOptions } from '../types';
import { ModuleHelper, QueryParams } from './module-helper';

export class FormsHelper extends ModuleHelper {
  health(options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get('/health', undefined, options);
  }

  branding(options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get('/branding', undefined, options);
  }

  list(params?: QueryParams, options?: RequestOptions): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/forms', params, options);
  }

  create(data: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>('/forms', data, options);
  }

  getForm(id: string, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get<any>(`/forms/${id}`, undefined, options);
  }

  getByCode(formCode: string, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get<any>(`/forms/by-code/${formCode}`, undefined, options);
  }

  getLanguages(formCode: string, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get<any>(`/forms/by-code/${formCode}/languages`, undefined, options);
  }

  update(id: string, data: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.put<any>(`/forms/${id}`, data, options);
  }

  deleteForm(id: string, options?: RequestOptions): Promise<ApiResponse<void>> {
    return this.delete<void>(`/forms/${id}`, options);
  }

  publish(id: string, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>(`/forms/${id}/publish`, {}, options);
  }

  unpublish(id: string, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>(`/forms/${id}/unpublish`, {}, options);
  }

  duplicate(id: string, data?: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>(`/forms/${id}/duplicate`, data || {}, options);
  }

  submit(id: string, data: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>(`/forms/${id}/submit`, data, options);
  }

  submitByCode(formCode: string, data: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>(`/forms/by-code/${formCode}/submit`, data, options);
  }

  submitTicket(formId: string, data: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>(`/forms/${formId}/submit-ticket`, data, options);
  }

  listSubmissions(formId: string, params?: QueryParams, options?: RequestOptions): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/forms/${formId}/submissions`, params, options);
  }

  submissionCounts(formId: string, params?: QueryParams, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get<any>(`/forms/${formId}/submissions/counts`, params, options);
  }

  reviewStatus(formId: string, params?: QueryParams, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get<any>(`/forms/${formId}/review-status`, params, options);
  }

  statusHistory(formId: string, params?: QueryParams, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get<any>(`/forms/${formId}/status-history`, params, options);
  }

  getSubmission(id: string, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get<any>(`/submissions/${id}`, undefined, options);
  }

  deleteSubmission(id: string, options?: RequestOptions): Promise<ApiResponse<void>> {
    return this.delete<void>(`/submissions/${id}`, options);
  }

  saveDraft(data: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>('/drafts', data, options);
  }

  getDraft(id: string, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.get<any>(`/drafts/${id}`, undefined, options);
  }

  convertDraft(id: string, data?: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<any>> {
    return this.post<any>(`/drafts/${id}/convert`, data || {}, options);
  }

  analytics = {
    form: (formId: string, params?: QueryParams, options?: RequestOptions) => this.get(`/analytics/forms/${formId}`, params, options),
    metrics: (formId: string, params?: QueryParams, options?: RequestOptions) => this.get(`/analytics/forms/${formId}/metrics`, params, options),
    compute: (formId: string, data?: Record<string, any>, options?: RequestOptions) =>
      this.post(`/analytics/forms/${formId}/compute`, data || {}, options),
  };

  drafts = {
    list: (params?: QueryParams, options?: RequestOptions) => this.get('/drafts', params, options),
    save: this.saveDraft.bind(this),
    stats: (params?: QueryParams, options?: RequestOptions) => this.get('/drafts/stats', params, options),
    get: this.getDraft.bind(this),
    update: (id: string, data: Record<string, any>, options?: RequestOptions) => this.put(`/drafts/${id}`, data, options),
    delete: (id: string, options?: RequestOptions) => this.delete(`/drafts/${id}`, options),
    convert: this.convertDraft.bind(this),
  };

  webhooks = {
    list: (params?: QueryParams, options?: RequestOptions) => this.get('/webhooks', params, options),
    create: (data: Record<string, any>, options?: RequestOptions) => this.post('/webhooks', data, options),
    get: (id: string, options?: RequestOptions) => this.get(`/webhooks/${id}`, undefined, options),
    delete: (id: string, options?: RequestOptions) => this.delete(`/webhooks/${id}`, options),
    test: (id: string, data?: Record<string, any>, options?: RequestOptions) => this.post(`/webhooks/${id}/test`, data || {}, options),
    logs: (id: string, params?: QueryParams, options?: RequestOptions) => this.get(`/webhooks/${id}/logs`, params, options),
  };

  workflows = {
    list: (params?: QueryParams, options?: RequestOptions) => this.get('/workflows', params, options),
    create: (data: Record<string, any>, options?: RequestOptions) => this.post('/workflows', data, options),
    get: (id: string, options?: RequestOptions) => this.get(`/workflows/${id}`, undefined, options),
    trigger: (id: string, data?: Record<string, any>, options?: RequestOptions) => this.post(`/workflows/${id}/trigger`, data || {}, options),
    history: (id: string, params?: QueryParams, options?: RequestOptions) => this.get(`/workflows/${id}/history`, params, options),
    execution: (id: string, options?: RequestOptions) => this.get(`/workflow-executions/${id}`, undefined, options),
  };

  assignments = {
    create: (data: Record<string, any>, options?: RequestOptions) => this.post('/assignments', data, options),
    auto: (data: Record<string, any>, options?: RequestOptions) => this.post('/assignments/auto', data, options),
    complete: (id: string, data?: Record<string, any>, options?: RequestOptions) => this.post(`/assignments/${id}/complete`, data || {}, options),
  };

  teams = {
    create: (data: Record<string, any>, options?: RequestOptions) => this.post('/teams', data, options),
    get: (id: string, options?: RequestOptions) => this.get(`/teams/${id}`, undefined, options),
  };

  agents = {
    create: (data: Record<string, any>, options?: RequestOptions) => this.post('/agents', data, options),
    available: (params?: QueryParams, options?: RequestOptions) => this.get('/agents/available', params, options),
    workload: (agentId: string, params?: QueryParams, options?: RequestOptions) => this.get(`/agents/${agentId}/workload`, params, options),
  };

  tickets = {
    list: (params?: QueryParams, options?: RequestOptions) => this.get('/tickets', params, options),
    create: (data: Record<string, any>, options?: RequestOptions) => this.post('/tickets', data, options),
    get: (id: string, options?: RequestOptions) => this.get(`/tickets/${id}`, undefined, options),
    update: (id: string, data: Record<string, any>, options?: RequestOptions) => this.put(`/tickets/${id}`, data, options),
    delete: (id: string, options?: RequestOptions) => this.delete(`/tickets/${id}`, options),
    status: (id: string, data: Record<string, any>, options?: RequestOptions) => this.patch(`/tickets/${id}/status`, data, options),
    comments: (id: string, params?: QueryParams, options?: RequestOptions) => this.get(`/tickets/${id}/comments`, params, options),
    addComment: (id: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/tickets/${id}/comments`, data, options),
    submission: (submissionId: string, options?: RequestOptions) => this.get(`/tickets/submission/${submissionId}`, undefined, options),
  };

  leads = {
    list: (params?: QueryParams, options?: RequestOptions) => this.get('/leads', params, options),
    create: (data: Record<string, any>, options?: RequestOptions) => this.post('/leads', data, options),
    hot: (params?: QueryParams, options?: RequestOptions) => this.get('/leads/hot', params, options),
    get: (id: string, options?: RequestOptions) => this.get(`/leads/${id}`, undefined, options),
    update: (id: string, data: Record<string, any>, options?: RequestOptions) => this.put(`/leads/${id}`, data, options),
    delete: (id: string, options?: RequestOptions) => this.delete(`/leads/${id}`, options),
    qualify: (id: string, data?: Record<string, any>, options?: RequestOptions) => this.post(`/leads/${id}/qualify`, data || {}, options),
    disqualify: (id: string, data?: Record<string, any>, options?: RequestOptions) => this.post(`/leads/${id}/disqualify`, data || {}, options),
    assign: (id: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/leads/${id}/assign`, data, options),
    recalculate: (id: string, data?: Record<string, any>, options?: RequestOptions) => this.post(`/leads/${id}/recalculate`, data || {}, options),
  };

  forums = {
    boards: (params?: QueryParams, options?: RequestOptions) => this.get('/forums/boards', params, options),
    threads: (boardId: string, params?: QueryParams, options?: RequestOptions) => this.get(`/forums/boards/${boardId}/threads`, params, options),
    createThread: (boardId: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/forums/boards/${boardId}/threads`, data, options),
    getThread: (threadId: string, options?: RequestOptions) => this.get(`/forums/threads/${threadId}`, undefined, options),
    posts: (threadId: string, params?: QueryParams, options?: RequestOptions) => this.get(`/forums/threads/${threadId}/posts`, params, options),
    createPost: (threadId: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/forums/threads/${threadId}/posts`, data, options),
    votePost: (postId: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/forums/posts/${postId}/vote`, data, options),
    moderateThread: (threadId: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/forums/threads/${threadId}/moderate`, data, options),
    moderatePost: (postId: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/forums/posts/${postId}/moderate`, data, options),
  };

  lists = {
    subscribe: (slug: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/lists/${slug}/subscribe`, data, options),
    confirm: (slug: string, token: string, options?: RequestOptions) => this.get(`/lists/${slug}/confirm/${token}`, undefined, options),
    unsubscribe: (slug: string, tokenOrData: string | Record<string, any>, options?: RequestOptions) =>
      typeof tokenOrData === 'string'
        ? this.get(`/lists/${slug}/unsubscribe/${tokenOrData}`, undefined, options)
        : this.post(`/lists/${slug}/unsubscribe`, tokenOrData, options),
    create: (data: Record<string, any>, options?: RequestOptions) => this.post('/admin/lists', data, options),
    list: (params?: QueryParams, options?: RequestOptions) => this.get('/admin/lists', params, options),
    events: (params?: QueryParams, options?: RequestOptions) => this.get('/admin/lists/events', params, options),
    get: (id: string, options?: RequestOptions) => this.get(`/admin/lists/${id}`, undefined, options),
    update: (id: string, data: Record<string, any>, options?: RequestOptions) => this.put(`/admin/lists/${id}`, data, options),
    delete: (id: string, options?: RequestOptions) => this.delete(`/admin/lists/${id}`, options),
    adminSubscribe: (id: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/admin/lists/${id}/subscribe`, data, options),
    subscribers: (id: string, params?: QueryParams, options?: RequestOptions) => this.get(`/admin/lists/${id}/subscribers`, params, options),
    updateSubscription: (id: string, subscriptionId: string, data: Record<string, any>, options?: RequestOptions) =>
      this.put(`/admin/lists/${id}/subscriptions/${subscriptionId}`, data, options),
    adminUnsubscribe: (id: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/admin/lists/${id}/unsubscribe`, data, options),
    adminConfirm: (id: string, data: Record<string, any>, options?: RequestOptions) => this.post(`/admin/lists/${id}/confirm`, data, options),
  };

  modules = {
    status: (options?: RequestOptions) => this.get('/module-install/status', undefined, options),
    dryRun: (data?: Record<string, any>, options?: RequestOptions) => this.post('/module-install/dry-run', data || {}, options),
    run: (data?: Record<string, any>, options?: RequestOptions) => this.post('/module-install/run', data || {}, options),
    list: (params?: QueryParams, options?: RequestOptions) => this.get('/modules', params, options),
    moduleStatus: (moduleName: string, options?: RequestOptions) => this.get(`/modules/${moduleName}/status`, undefined, options),
    moduleDryRun: (moduleName: string, data?: Record<string, any>, options?: RequestOptions) =>
      this.post(`/modules/${moduleName}/dry-run`, data || {}, options),
    moduleRun: (moduleName: string, data?: Record<string, any>, options?: RequestOptions) => this.post(`/modules/${moduleName}/run`, data || {}, options),
    registry: (params?: QueryParams, options?: RequestOptions) => this.get('/module-registry', params, options),
    updateDryRun: (data?: Record<string, any>, options?: RequestOptions) => this.post('/module-registry/update/dry-run', data || {}, options),
    update: (data?: Record<string, any>, options?: RequestOptions) => this.post('/module-registry/update', data || {}, options),
  };
}
