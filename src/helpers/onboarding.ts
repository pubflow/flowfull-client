import type { ApiResponse } from '../types';
import { ModuleHelper, QueryParams } from './module-helper';

export class OnboardingHelper extends ModuleHelper {
  getState(params?: QueryParams): Promise<ApiResponse<any>> {
    return this.get<any>('', params);
  }

  start(data: Record<string, any> = {}): Promise<ApiResponse<any>> {
    return this.post<any>('/start', data);
  }

  completeStep(step: string, data: Record<string, any> = {}): Promise<ApiResponse<any>> {
    return this.post<any>(`/steps/${step}/complete`, data);
  }

  skipStep(step: string, data: Record<string, any> = {}): Promise<ApiResponse<any>> {
    return this.post<any>(`/steps/${step}/skip`, data);
  }

  finish(data: Record<string, any> = {}): Promise<ApiResponse<any>> {
    return this.post<any>('/complete', data);
  }
}
