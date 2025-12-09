/**
 * SessionManager Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SessionManager } from '../src/core/session-manager';
import { StorageAdapter } from '../src/types';

describe('SessionManager', () => {
  describe('Constructor', () => {
    it('should create instance with default config', () => {
      const manager = new SessionManager();
      expect(manager).toBeInstanceOf(SessionManager);
    });

    it('should create instance with custom config', () => {
      const manager = new SessionManager({
        sessionId: 'test-session-123',
        sessionHeader: 'X-Custom-Session',
        includeSession: true
      });
      expect(manager).toBeInstanceOf(SessionManager);
    });

    it('should accept empty config', () => {
      const manager = new SessionManager({});
      expect(manager).toBeInstanceOf(SessionManager);
    });
  });

  describe('getSessionId()', () => {
    it('should return null when includeSession is false', async () => {
      const manager = new SessionManager({
        includeSession: false,
        sessionId: 'test-session'
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBeNull();
    });

    it('should return static sessionId from config', async () => {
      const manager = new SessionManager({
        sessionId: 'static-session-123'
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('static-session-123');
    });

    it('should return sessionId from getSessionId function (sync)', async () => {
      const manager = new SessionManager({
        getSessionId: () => 'function-session-456'
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('function-session-456');
    });

    it('should return sessionId from getSessionId function (async)', async () => {
      const manager = new SessionManager({
        getSessionId: async () => 'async-session-789'
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('async-session-789');
    });

    it('should return sessionId from storage adapter', async () => {
      const mockStorage: StorageAdapter = {
        getItem: async (key: string) => {
          if (key === 'pubflow_session_id') {
            return 'storage-session-abc';
          }
          return null;
        },
        setItem: async () => {},
        removeItem: async () => {}
      };

      const manager = new SessionManager({
        storage: mockStorage
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('storage-session-abc');
    });

    it('should prioritize static sessionId over function', async () => {
      const manager = new SessionManager({
        sessionId: 'static-session',
        getSessionId: () => 'function-session'
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('static-session');
    });

    it('should prioritize function over storage', async () => {
      const mockStorage: StorageAdapter = {
        getItem: async () => 'storage-session',
        setItem: async () => {},
        removeItem: async () => {}
      };

      const manager = new SessionManager({
        getSessionId: () => 'function-session',
        storage: mockStorage
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('function-session');
    });

    it('should handle getSessionId returning null', async () => {
      const manager = new SessionManager({
        getSessionId: () => null
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBeNull();
    });

    it('should handle storage errors gracefully', async () => {
      const mockStorage: StorageAdapter = {
        getItem: async () => {
          throw new Error('Storage error');
        },
        setItem: async () => {},
        removeItem: async () => {}
      };

      const manager = new SessionManager({
        storage: mockStorage
      });
      
      const sessionId = await manager.getSessionId();
      expect(sessionId).toBeNull();
    });
  });

  describe('setSessionId()', () => {
    it('should set session ID', async () => {
      const manager = new SessionManager();
      
      manager.setSessionId('new-session-123');
      const sessionId = await manager.getSessionId();
      
      expect(sessionId).toBe('new-session-123');
    });

    it('should override existing session ID', async () => {
      const manager = new SessionManager({
        sessionId: 'old-session'
      });
      
      manager.setSessionId('new-session');
      const sessionId = await manager.getSessionId();
      
      expect(sessionId).toBe('new-session');
    });
  });

  describe('clearSession()', () => {
    it('should clear session ID', async () => {
      const manager = new SessionManager({
        sessionId: 'test-session'
      });

      manager.clearSession();
      const sessionId = await manager.getSessionId();

      expect(sessionId).toBeNull();
    });

    it('should clear cached session', async () => {
      const manager = new SessionManager();
      manager.setSessionId('cached-session');

      manager.clearSession();
      const sessionId = await manager.getSessionId();

      expect(sessionId).toBeNull();
    });
  });

  describe('hasSession()', () => {
    it('should return true when session exists', async () => {
      const manager = new SessionManager({
        sessionId: 'test-session'
      });

      const hasSession = await manager.hasSession();
      expect(hasSession).toBe(true);
    });

    it('should return false when session is null', async () => {
      const manager = new SessionManager();

      const hasSession = await manager.hasSession();
      expect(hasSession).toBe(false);
    });

    it('should return false when session is empty string', async () => {
      const manager = new SessionManager({
        sessionId: ''
      });

      const hasSession = await manager.hasSession();
      expect(hasSession).toBe(false);
    });

    it('should return false when includeSession is false', async () => {
      const manager = new SessionManager({
        sessionId: 'test-session',
        includeSession: false
      });

      const hasSession = await manager.hasSession();
      expect(hasSession).toBe(false);
    });
  });

  describe('getSessionHeader()', () => {
    it('should return default session header', () => {
      const manager = new SessionManager();

      const header = manager.getSessionHeader();
      expect(header).toBe('X-Session-ID');
    });

    it('should return custom session header', () => {
      const manager = new SessionManager({
        sessionHeader: 'X-Custom-Session'
      });

      const header = manager.getSessionHeader();
      expect(header).toBe('X-Custom-Session');
    });
  });

  describe('updateConfig()', () => {
    it('should update session ID', async () => {
      const manager = new SessionManager({
        sessionId: 'old-session'
      });

      manager.updateConfig({
        sessionId: 'new-session'
      });

      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('new-session');
    });

    it('should update getSessionId function', async () => {
      const manager = new SessionManager({
        sessionId: 'static-session'
      });

      manager.updateConfig({
        getSessionId: () => 'function-session'
      });

      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('function-session');
    });

    it('should clear cache when session config changes', async () => {
      const manager = new SessionManager();
      manager.setSessionId('cached-session');

      manager.updateConfig({
        sessionId: 'new-session'
      });

      const sessionId = await manager.getSessionId();
      expect(sessionId).toBe('new-session');
    });

    it('should update includeSession flag', async () => {
      const manager = new SessionManager({
        sessionId: 'test-session',
        includeSession: true
      });

      manager.updateConfig({
        includeSession: false
      });

      const sessionId = await manager.getSessionId();
      expect(sessionId).toBeNull();
    });
  });
});

