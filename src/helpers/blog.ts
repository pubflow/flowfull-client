import type { FlowfullClient } from '../core/client';
import type { ApiResponse } from '../types';
import { joinPath, ModuleHelper, QueryParams } from './module-helper';

export class BlogHelper extends ModuleHelper {
  constructor(
    client: FlowfullClient,
    prefix = '/api/v1/posts',
    private readonly postTypesPrefix = '/api/v1/post-types'
  ) {
    super(client, prefix);
  }

  private postTypesGet<T = any>(path = '', params?: QueryParams): Promise<ApiResponse<T>> {
    return this.client.get<T>(joinPath(this.postTypesPrefix, path), { params });
  }

  private postTypesSend<T = any>(method: 'post' | 'put' | 'delete', path = '', body?: any): Promise<ApiResponse<T>> {
    const target = joinPath(this.postTypesPrefix, path);
    if (method === 'put') return this.client.put<T>(target, body);
    if (method === 'delete') return this.client.delete<T>(target);
    return this.client.post<T>(target, body);
  }

  listPosts(params?: QueryParams): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('', params);
  }

  createPost(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.post<any>('', data);
  }

  getPost(slug: string, params?: QueryParams): Promise<ApiResponse<any>> {
    return this.get<any>(`/${slug}`, params);
  }

  getPostById(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/id/${id}`);
  }

  updatePost(id: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.put<any>(`/${id}`, data);
  }

  publishPost(id: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/${id}/publish`, {});
  }

  unpublishPost(id: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/${id}/unpublish`, {});
  }

  schedulePost(id: string, scheduledAt: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/${id}/schedule`, { scheduled_at: scheduledAt });
  }

  deletePost(id: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/${id}`);
  }

  restorePost(id: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/${id}/restore`, {});
  }

  getAuthor(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/authors/${id}`);
  }

  uploadFeaturedImage(id: string, file: File | Blob): Promise<ApiResponse<any>> {
    return this.client.uploadFile(this.path(`/${id}/featured-image`), file, { field: 'image' });
  }

  deleteFeaturedImage(id: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/${id}/featured-image`);
  }

  listCategories(params?: QueryParams): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/categories', params);
  }

  createCategory(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.post<any>('/categories', data);
  }

  createCategoryBulk(data: { names: string[]; lang?: string }): Promise<ApiResponse<any[]>> {
    return this.post<any[]>('/categories/bulk', data);
  }

  updateCategory(id: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.put<any>(`/categories/${id}`, data);
  }

  deleteCategory(id: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/categories/${id}`);
  }

  listTags(params?: QueryParams): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/tags', params);
  }

  createTag(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.post<any>('/tags', data);
  }

  createTagBulk(data: { names: string[] }): Promise<ApiResponse<any[]>> {
    return this.post<any[]>('/tags/bulk', data);
  }

  updateTag(id: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.put<any>(`/tags/${id}`, data);
  }

  deleteTag(id: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/tags/${id}`);
  }

  listComments(postId: string, params?: QueryParams): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/${postId}/comments`, params);
  }

  createComment(postId: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.post<any>(`/${postId}/comments`, data);
  }

  updateComment(postId: string, commentId: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.put<any>(`/${postId}/comments/${commentId}`, data);
  }

  deleteComment(postId: string, commentId: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/${postId}/comments/${commentId}`);
  }

  moderateComment(commentId: string, data: { status: string }): Promise<ApiResponse<any>> {
    return this.post<any>(`/comments/${commentId}/moderate`, data);
  }

  getReactions(postId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/${postId}/reactions`);
  }

  react(postId: string, reactionType: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/${postId}/reactions`, { reaction_type: reactionType });
  }

  bookmark(postId: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/${postId}/bookmark`, {});
  }

  removeBookmark(postId: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/${postId}/bookmark`);
  }

  listBookmarks(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/me/bookmarks');
  }

  trackView(postId: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/${postId}/view`, {});
  }

  getStats(postId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/${postId}/stats`);
  }

  listTranslations(postId: string): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/id/${postId}/translations`);
  }

  createTranslation(postId: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.post<any>(`/id/${postId}/translations`, data);
  }

  updateTranslation(postId: string, lang: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.put<any>(`/id/${postId}/translations/${lang}`, data);
  }

  deleteTranslation(postId: string, lang: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/id/${postId}/translations/${lang}`);
  }

  getSitemap(): Promise<ApiResponse<any>> {
    return this.get<any>('/seo/sitemap.xml');
  }

  listPostTypes(params?: QueryParams): Promise<ApiResponse<any[]>> {
    return this.postTypesGet<any[]>('', params);
  }

  getPostType(key: string): Promise<ApiResponse<any>> {
    return this.postTypesGet<any>(`/${key}`);
  }

  getPostTypeSchema(key: string): Promise<ApiResponse<any>> {
    return this.postTypesGet<any>(`/${key}/schema`);
  }

  getPostTypeStats(key: string): Promise<ApiResponse<any>> {
    return this.postTypesGet<any>(`/${key}/stats`);
  }

  createPostType(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.postTypesSend('post', '', data);
  }

  updatePostType(key: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.postTypesSend('put', `/${key}`, data);
  }

  deletePostType(key: string): Promise<ApiResponse<any>> {
    return this.postTypesSend('delete', `/${key}`);
  }
}
