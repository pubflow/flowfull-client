/**
 * Session Manager
 * 
 * Manages session ID retrieval and storage
 */

import { SessionConfig } from '../types';
import { autoDetectSessionId } from '../utils';

/**
 * Session manager class
 */
export class SessionManager {
  private config: SessionConfig;
  private cachedSessionId: string | null = null;
  
  constructor(config: SessionConfig = {}) {
    this.config = {
      includeSession: true,
      sessionHeader: 'X-Session-ID',
      ...config
    };
  }
  
  /**
   * Get session ID
   * 
   * Priority order:
   * 1. Static sessionId from config
   * 2. getSessionId() function from config
   * 3. Storage adapter
   * 4. Auto-detect from common storage keys
   * 
   * @returns Session ID or null
   */
  async getSessionId(): Promise<string | null> {
    // Check if session should be included
    if (this.config.includeSession === false) {
      return null;
    }
    
    // 1. Static session ID
    if (this.config.sessionId) {
      return this.config.sessionId;
    }
    
    // 2. getSessionId function
    if (this.config.getSessionId) {
      const sessionId = await this.config.getSessionId();
      if (sessionId) {
        return sessionId;
      }
    }
    
    // 3. Storage adapter
    if (this.config.storage) {
      try {
        const sessionId = await this.config.storage.getItem('pubflow_session_id');
        if (sessionId) {
          return sessionId;
        }
      } catch (error) {
        // Ignore storage errors
      }
    }
    
    // 4. Auto-detect
    return this.autoDetectSession();
  }
  
  /**
   * Auto-detect session from common storage keys
   * 
   * @returns Session ID or null
   */
  private async autoDetectSession(): Promise<string | null> {
    // Use cached session if available
    if (this.cachedSessionId) {
      return this.cachedSessionId;
    }
    
    // Auto-detect
    const sessionId = await autoDetectSessionId();
    
    // Cache for future requests
    if (sessionId) {
      this.cachedSessionId = sessionId;
    }
    
    return sessionId;
  }
  
  /**
   * Set session ID
   * 
   * @param sessionId - Session ID to set
   */
  setSessionId(sessionId: string): void {
    this.config.sessionId = sessionId;
    this.cachedSessionId = sessionId;
  }
  
  /**
   * Clear session
   */
  clearSession(): void {
    this.config.sessionId = undefined;
    this.cachedSessionId = null;
  }
  
  /**
   * Check if session is available
   * 
   * @returns True if session is available
   */
  async hasSession(): Promise<boolean> {
    const sessionId = await this.getSessionId();
    return sessionId !== null && sessionId !== undefined && sessionId !== '';
  }
  
  /**
   * Get session header name
   * 
   * @returns Session header name
   */
  getSessionHeader(): string {
    return this.config.sessionHeader || 'X-Session-ID';
  }
  
  /**
   * Update configuration
   * 
   * @param config - New configuration
   */
  updateConfig(config: Partial<SessionConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
    
    // Clear cache if session config changed
    if (config.sessionId !== undefined || config.getSessionId !== undefined) {
      this.cachedSessionId = null;
    }
  }
}

