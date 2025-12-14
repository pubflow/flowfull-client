/**
 * Session Manager
 *
 * Manages session ID retrieval and storage with multi-tenant support
 */

import { SessionConfig, StorageAdapter } from '../types';
import { autoDetectSessionId } from '../utils';

/**
 * Session manager class
 */
export class SessionManager {
  private config: SessionConfig;
  private cachedSessionId: string | null = null;
  private storage: StorageAdapter | null = null;
  private storagePrefix: string = '';

  constructor(config: SessionConfig = {}) {
    this.config = {
      includeSession: true,
      sessionHeader: 'X-Session-ID',
      ...config
    };

    // Setup storage with prefix support
    if (config.storageConfig) {
      this.storage = config.storageConfig.adapter || null;
      this.storagePrefix = config.storageConfig.prefix || '';
    } else if (config.storage) {
      this.storage = config.storage;
      this.storagePrefix = '';
    }
  }

  /**
   * Get storage key with prefix
   *
   * @param key - Base key name
   * @returns Prefixed key
   */
  private getStorageKey(key: string): string {
    if (this.storagePrefix) {
      return `${this.storagePrefix}_${key}`;
    }
    return key;
  }
  
  /**
   * Get session ID
   *
   * Priority order:
   * 1. Static sessionId from config
   * 2. getSessionId() function from config
   * 3. Storage adapter (with prefix support)
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

    // 3. Storage adapter (with prefix support)
    if (this.storage) {
      try {
        const key = this.getStorageKey('pubflow_session_id');
        const sessionId = await this.storage.getItem(key);
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

